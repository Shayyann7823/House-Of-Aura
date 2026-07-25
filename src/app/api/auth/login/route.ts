import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email aur password required hain" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: "Email ya password ghalat hai" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Email ya password ghalat hai" }, { status: 401 });
    }

    await createSession(user.id, user.email, user.fullName);

    return NextResponse.json({ id: user.id, email: user.email, fullName: user.fullName });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Kuch masla ho gaya, dobara try karein" }, { status: 500 });
  }
}