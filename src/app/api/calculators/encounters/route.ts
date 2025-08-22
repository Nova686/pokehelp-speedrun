import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { ratePercent, trials } = await req.json();
  const p = Math.max(0, Math.min(100, +ratePercent || 0)) / 100;
  const n = Math.max(0, +trials || 0);
  const atLeastOne = 1 - Math.pow(1 - p, n);
  const percent = +(Math.max(0, Math.min(1, atLeastOne)) * 100).toFixed(2);
  return NextResponse.json({ percent });
}
