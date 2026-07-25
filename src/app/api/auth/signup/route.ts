import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName?.trim() || !email?.trim() || !password || password.length < 6) {
      return NextResponse.json({ error: "Sab fields sahi se bharein (password 6+ chars)" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Is email se account pehle se maujood hai" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { fullName: fullName.trim(), email: email.trim().toLowerCase(), passwordHash },
    });

    await createSession(user.id, user.email, user.fullName);

    return NextResponse.json({ id: user.id, email: user.email, fullName: user.fullName });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Kuch masla ho gaya, dobara try karein" }, { status: 500 });
  }
}