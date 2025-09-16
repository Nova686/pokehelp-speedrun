import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type StepV2 = { title: string; notes?: string; subs: string[] };

function sanitizeSteps(input: unknown): StepV2[] {
  if (!Array.isArray(input)) return [];
  if ((input as any[]).every((s) => typeof s === "string")) {
    return (input as string[]).map((t) => ({ title: String(t).trim(), subs: [] }));
  }
  return (input as any[])
    .map((raw) => {
      const title = typeof raw?.title === "string" ? raw.title.trim() : "";
      const notes = typeof raw?.notes === "string" ? raw.notes.trim() : undefined;
      const subs = Array.isArray(raw?.subs)
        ? raw.subs.map((x: unknown) => String(x ?? "").trim()).filter(Boolean)
        : [];
      return { title, notes, subs };
    })
    .filter((s) => s.title);
}

export async function GET(_req: Request, context: any) {
  const id = context?.params?.id as string;
  const route = await prisma.speedrunRoute.findUnique({
    where: { id },
    include: { ratings: true, user: { select: { id: true, name: true } } },
  });
  if (!route) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(route);
}

export async function PATCH(req: Request, context: any) {
  const id = context?.params?.id as string;
  const existing = await prisma.speedrunRoute.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const title =
    typeof body.title === "string" ? body.title.trim() : existing.title;
  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : existing.description;

  let steps: StepV2[] = Array.isArray(existing.steps)
    ? sanitizeSteps(existing.steps)
    : [];
  if (Array.isArray(body.steps)) steps = sanitizeSteps(body.steps);

  const updated = await prisma.speedrunRoute.update({
    where: { id },
    data: { title, description, steps },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, context: any) {
  const id = context?.params?.id as string;
  const existing = await prisma.speedrunRoute.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.speedrunRoute.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
