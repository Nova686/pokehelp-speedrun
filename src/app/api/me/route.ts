import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readCookie(headers: Headers, key: string): string | null {
  const all = headers.get("cookie");
  if (!all) return null;
  for (const part of all.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === key) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export async function GET(req: Request) {
  const uid = readCookie(req.headers, "uid") || req.headers.get("x-user-id");
  if (!uid) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name ?? null },
  });
}
