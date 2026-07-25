import { NextRequest, NextResponse } from "next/server";
import { generateLook, type Gender, type Style, type Occasion } from "@/lib/stylist-engine";
import { PRODUCTS } from "@/lib/products";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are "Heemia Stylist" — a warm, helpful fashion stylist chatbot for Heemia, a Pakistani clothing brand.
You chat naturally with customers to figure out what outfit they need.
You need to collect: gender and occasion always. Style (eastern/western) is ONLY needed for men and women — kids don't have a style split, so NEVER ask a kids customer about style.
Color preference is optional. Never ask about budget or price.

STRICT MAPPING RULES — follow these exactly, never guess or assume:
- gender: "male"/"man"/"men"/"boy" → "men". "female"/"woman"/"women"/"girl" → "women". Only use "kids"/"child"/"bacha"/"bachay" if the customer EXPLICITLY says kids/child/son/daughter. Never default to kids.
- style: "western" → "western". "eastern"/"desi" → "eastern". For kids, just use "western" internally without asking — it's ignored.
- occasion: match to one of Wedding, Eid, Casual, Office, Party, Formal based on what the customer actually said. Never invent an occasion they didn't mention — ask if unclear.
- If gender is "kids", you MUST also ask whether it's for a boy or a girl before recommending — never skip this, and never guess it from other context.

NEVER change gender, occasion, style, or boy/girl that the customer already told you earlier in this conversation, unless they explicitly say something new. A short follow-up message (like "and perfume", "add something", "more options", "anything else?", "koi dusre clothes") is a REQUEST TO SEE A DIFFERENT/ADDITIONAL PICK FOR THE SAME OUTFIT — it is never a reason to switch gender, occasion, or style.

Kids outfits do NOT include perfume — only "Kids Outfit" and "Accessory". If a customer with a kids request asks for perfume (or anything not offered for kids), politely tell them perfume isn't part of the kids range, and offer to add another accessory instead or ask if they'd like something for themselves too. Do NOT silently switch to a different gender to fulfill the request.

When the customer asks for "something else", "another option", "koi dusre clothes/products", or similar — call recommend_look AGAIN with the exact same gender/style/occasion/kidsGender as before, so the system can pick different products than what was already shown.

Ask friendly follow-up questions ONE AT A TIME if info is missing.

CRITICAL RULE — only call recommend_look ONCE per distinct request:
- If you already gave a recommendation earlier in this conversation and the customer's new message is just a filler/reaction ("lol", "ok", "thanks", "nice", a greeting, etc.) and does NOT ask for a new/different outfit or more options, DO NOT call the function again — just reply conversationally (e.g. ask if they want anything else, or say goodbye warmly).
- Call the function again whenever the customer gives NEW/CHANGED preferences, OR explicitly asks for another/different option — reuse everything from earlier in the conversation that hasn't changed.

Keep replies short and conversational. Never invent product names or prices yourself — always use the function to get real recommendations.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "recommend_look",
      description: "Get a real outfit recommendation from the Heemia catalog based on customer preferences.",
      parameters: {
        type: "object",
        properties: {
          gender: { type: "string", enum: ["men", "women", "kids"] },
          style: { type: "string", enum: ["eastern", "western"], description: "Not needed for kids" },
          occasion: { type: "string", enum: ["Wedding", "Eid", "Casual", "Office", "Party", "Formal"] },
          colorPreference: { type: "string", description: "Optional color preference" },
          kidsGender: { type: "string", enum: ["boy", "girl"], description: "Required only when gender is kids" },
        },
        required: ["gender", "occasion"],
      },
    },
  },
];

// Only the last N messages are sent to Groq — keeps token usage bounded even
// once a conversation runs long, since the free tier has a strict per-minute
// token limit. The UI still keeps and shows the full history; this only
// trims what we forward to the model.
const MAX_HISTORY_MESSAGES = 8;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY missing in .env.local" }, { status: 500 });
    }

    const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);
    const baseMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...trimmedMessages];

    // 1st call — let the model decide if it has enough info to call the tool
    const first = await callGroq(baseMessages, true);
    const firstMsg = first.choices[0].message;

    // No tool call yet — model is just asking a follow-up question
    if (!firstMsg.tool_calls || firstMsg.tool_calls.length === 0) {
      return NextResponse.json({ reply: firstMsg.content });
    }

    // Model wants to call recommend_look — run it for real against our catalog
    const toolCall = firstMsg.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);

    // Figure out which products were already shown earlier, so we don't repeat them
    const excludeIds = findMentionedProductIds(messages);

    const look = generateLook({
      gender: args.gender as Gender,
      style: (args.style as Style) || "western",
      occasion: args.occasion as Occasion,
      budgetPKR: 1_000_000,
      colorPreference: args.colorPreference,
      kidsGender: args.kidsGender,
      excludeIds,
    });

    // 2nd call — feed the real result back so the model can write a natural reply
    const followUp = [
      ...baseMessages,
      firstMsg,
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(look),
      },
    ];

    const second = await callGroq(followUp, false);
    const finalText = second.choices[0].message.content;

    return NextResponse.json({ reply: finalText, look });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Stylist thoda busy hai, dobara try karein." }, { status: 500 });
  }
}

function findMentionedProductIds(messages: any[]): string[] {
  const text = messages
    .filter((m) => m.role === "assistant")
    .map((m) => m.content || "")
    .join(" ")
    .toLowerCase();

  return PRODUCTS.filter((p) => text.includes(p.name.toLowerCase())).map((p) => p.id);
}

async function callGroq(messages: any[], allowTools: boolean, attempt = 1): Promise<any> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(allowTools ? { tools: TOOLS, tool_choice: "auto" } : {}),
      temperature: 0.2,
    }),
  });

  if (res.status === 429 && attempt < 2) {
    // Brief, one-time retry on a momentary rate-limit hit before failing.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return callGroq(messages, allowTools, attempt + 1);
  }

  if (!res.ok) throw new Error(`Groq error: ${res.status} ${await res.text()}`);
  return res.json();
}