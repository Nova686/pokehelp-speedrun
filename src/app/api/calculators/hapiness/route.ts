import { NextResponse } from "next/server";

const ACTIONS: Record<string, number> = {
  walk: 1,
  battle: 5,
  faint: -10,
  sootheBell: 2,
};

export async function POST(req: Request) {
  const { current, action } = await req.json();
  const base = Math.max(0, Math.min(255, +current || 0));
  const delta = ACTIONS[action] ?? 0;
  const value = Math.max(0, Math.min(255, base + delta));
  return NextResponse.json({ value });
}
