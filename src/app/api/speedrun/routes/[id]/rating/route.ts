import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSessionFromHeaders } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, context: any) {
  try {
    const routeId = context?.params?.id as string;
    const session = await getServerSessionFromHeaders(req.headers);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
    }

    const payload = body as { value?: unknown };
    const value = Number((payload.value as any) ?? NaN);
    if (!Number.isFinite(value) || value < 1 || value > 5) return NextResponse.json({ error: "INVALID_VALUE" }, { status: 400 });

    const exists = await prisma.speedrunRoute.findUnique({ where: { id: routeId } });
    if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.rating.upsert({
      where: { userId_routeId: { userId: session.user.id, routeId } },
      update: { value },
      create: { userId: session.user.id, routeId, value }
    });

    const updated = await prisma.speedrunRoute.findUnique({
      where: { id: routeId },
      include: { user: { select: { id: true, name: true } }, ratings: true }
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: "DB_ERROR", detail: String(e?.message ?? e) }, { status: 500 });
  }
}
