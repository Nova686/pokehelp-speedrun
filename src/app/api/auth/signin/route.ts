import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const { email, name, password } = body as { email?: unknown; name?: unknown; password?: unknown };
  const em = typeof email === "string" ? email.trim().toLowerCase() : "";
  const nm = typeof name === "string" ? name.trim() : "";
  const pw = typeof password === "string" ? password : "";

  if (!em || !nm || !pw) return NextResponse.json({ error: "EMAIL_NAME_PASSWORD_REQUIRED" }, { status: 400 });
  if (pw.length < 8) return NextResponse.json({ error: "PASSWORD_TOO_SHORT" }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: em } });
  if (exists) return NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 });

  const passwordHash = await bcrypt.hash(pw, 10);
  const user = await prisma.user.create({ data: { email: em, name: nm, passwordHash } });

  const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  const isProd = process.env.NODE_ENV === "production";
  res.headers.append(
    "Set-Cookie",
    `uid=${encodeURIComponent(user.id)}; Path=/; HttpOnly; SameSite=Lax; ${isProd ? "Secure; " : ""}Max-Age=${60 * 60 * 24 * 30}`
  );
  return res;
}
