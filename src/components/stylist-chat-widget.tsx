"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Send, Sparkles, RotateCcw, ShoppingBag } from "lucide-react";
import { formatPKR } from "@/lib/products";
import type { RecommendedLook } from "@/lib/stylist-engine";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

const HIDDEN_ROUTES = ["/auth", "/cart", "/favorites", "/checkout"];

type ChatMessage = { role: "user" | "assistant"; content: string; look?: RecommendedLook };

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Assalam-o-Alaikum! Main aapka House of Aura Stylist hoon ✨ Kis occasion ke liye outfit chahiye — Wedding, Eid, Office, Party, ya Casual?",
};

export function StylistChatWidget() {
  const pathname = usePathname();
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (HIDDEN_ROUTES.some((r) => pathname.startsWith(r))) return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Kuch masla ho gaya, dobara try karein.", look: data.look }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection issue — dobara try karein." }]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  }

  function addLookToCart(look: RecommendedLook) {
    look.items.forEach((item) => add(item.product));
    toast.success(`${look.items.length} items added to cart`);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-primary text-primary-foreground border border-gold/30 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold/20 bg-primary">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-sm uppercase tracking-[0.2em] text-gold">House of Aura Stylist</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={clearChat} title="Clear chat" className="text-primary-foreground/70 hover:text-gold">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-gold text-gold-foreground" : "bg-primary-foreground/10 text-primary-foreground"
                  }`}
                >
                  {m.content}

                  {m.look && m.look.items.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {m.look.items.map((it) => (
                        <Link
                          key={it.product.id}
                          href={`/product/${it.product.id}`}
                          className="flex items-center gap-2 bg-black/20 hover:bg-black/30 rounded p-2 transition-colors"
                        >
                          <img src={it.product.image} alt={it.product.name} className="h-12 w-12 object-cover rounded" />
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-wide text-gold">{it.role}</div>
                            <div className="text-xs truncate">{it.product.name}</div>
                            <div className="text-xs text-gold">{formatPKR(it.product.price)}</div>
                          </div>
                        </Link>
                      ))}
                      <div className="text-xs pt-1 text-gold">Total: {formatPKR(m.look.totalPKR)}</div>

                      <button
                        onClick={() => addLookToCart(m.look!)}
                        className="w-full mt-1 flex items-center justify-center gap-2 bg-gold text-gold-foreground rounded px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Add All to Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-primary-foreground/50">Stylist type kar raha hai…</div>}
          </div>

          {/* input */}
          <div className="flex items-center gap-2 border-t border-gold/20 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Apna message likhein…"
              className="flex-1 bg-transparent border border-gold/30 rounded px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <button
              onClick={send}
              disabled={loading}
              className="bg-gold text-gold-foreground p-2 rounded hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-gold text-gold-foreground px-5 py-3 rounded-full shadow-gold flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] hover:opacity-90 hover:scale-105 transition-all ring-2 ring-gold/30 ring-offset-2 ring-offset-transparent"
      >
        <Sparkles className="h-4 w-4" />
        {open ? "Close" : "Ask Our Stylist"}
      </button>
    </div>
  );
}