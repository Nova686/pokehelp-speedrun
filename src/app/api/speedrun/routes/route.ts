import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StepV2 = { title: string; notes?: string; subs: string[] };

function sanitizeSteps(input: unknown): StepV2[] {
  if (!Array.isArray(input)) return [];
  if (input.every(s => typeof s === "string")) {
    return (input as string[]).map((t) => ({ title: String(t).trim(), subs: [] }));
  }
  return (input as any[]).map((raw) => {
    const title = typeof raw?.title === "string" ? raw.title.trim() : "";
    const notes = typeof raw?.notes === "string" ? raw.notes.trim() : undefined;
    const subs = Array.isArray(raw?.subs)
      ? raw.subs.map((x: unknown) => String(x ?? "").trim()).filter(Boolean)
      : [];
    return { title, notes, subs };
  }).filter(s => s.title);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const game = searchParams.get("game")?.trim() || "";

  const where = game ? { game } : {};

  const routes = await prisma.speedrunRoute.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true } },
      ratings: { select: { value: true } },
    },
  });

  return NextResponse.json(routes);
}

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 }); }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const steps = sanitizeSteps(body.steps);

  if (!title || !description || steps.length === 0) {
    return NextResponse.json({ error: "TITLE_DESCRIPTION_STEPS_REQUIRED" }, { status: 400 });
  }

  const cookie = req.headers.get("cookie") ?? "";
  const uid = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("uid="))?.split("=")[1] ?? undefined;

  const created = await prisma.speedrunRoute.create({
    data: {
      title,
      description,
      steps,
      createdBy: uid ?? "anonymous"
    }
  });

  return NextResponse.json(created, { status: 201 });
}
