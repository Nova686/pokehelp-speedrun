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

export async function POST(req: Request, context: any) {
  const routeId = String(context?.params?.id || "");
  if (!routeId) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  const uid = readCookie(req.headers, "uid") || req.headers.get("x-user-id");
  if (!uid) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    const txt = await req.text().catch(() => "");
    try { body = JSON.parse(txt); } catch {
      return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
    }
  }

  const raw = Number(body?.value);
  const value = Math.round(raw);
  if (!Number.isFinite(value) || value < 1 || value > 5) {
    return NextResponse.json({ error: "INVALID_VALUE" }, { status: 400 });
  }

  const exists = await prisma.speedrunRoute.findUnique({ where: { id: routeId } });
  if (!exists) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  await prisma.rating.upsert({
    where: { userId_routeId: { userId: uid, routeId } },
    create: { userId: uid, routeId, value },
    update: { value },
  });

  const agg = await prisma.rating.aggregate({
    where: { routeId },
    _avg: { value: true },
    _count: true,
  });

  const average = Number(agg._avg.value || 0);
  const count = Number(agg._count ?? (agg as any)._count?._all ?? 0);

  return NextResponse.json({
    ok: true,
    routeId,
    userValue: value,
    average,
    count,
  });
}
