import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { evs } = await req.json();
  const arr: number[] = Array.isArray(evs) ? evs.map((x: any) => +x || 0) : [0,0,0,0,0,0];
  const total = arr.reduce((a, b) => a + b, 0);
  const perStatOk = arr.every((e) => e >= 0 && e <= 252);
  const totalOk = total <= 510;
  return NextResponse.json({ total, perStatOk, totalOk });
}
