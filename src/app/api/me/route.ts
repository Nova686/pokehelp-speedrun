import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getCookieValue(cookieHeader: string | null, key: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map(s => s.trim());
  for (const p of parts) {
    const [k, ...rest] = p.split("=");
    if (k === key) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const id = getCookieValue(cookieHeader, "uid");
  if (!id) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } });
  return NextResponse.json({ user: user ?? null });
}
