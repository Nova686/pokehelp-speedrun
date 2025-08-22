import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { calls } = await req.json();
  const c = Math.max(0, +calls || 0);
  const base = 1 / 4096;
  const odds = Math.min(1, base * (1 + c * 0.05));
  const percent = +(odds * 100).toFixed(4);
  return NextResponse.json({ percent });
}
