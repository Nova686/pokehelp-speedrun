import { NextResponse } from "next/server";

type EVBody = { evs: Array<number | string> };

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<EVBody>;
  const arr: number[] = Array.isArray(body.evs)
    ? body.evs.map((x) => {
        const n = Number(x);
        return Number.isFinite(n) ? n : 0;
      })
    : [0, 0, 0, 0, 0, 0];

  const total = arr.reduce((a, b) => a + b, 0);
  const perStatOk = arr.every((e) => e >= 0 && e <= 252);
  const totalOk = total <= 510;

  return NextResponse.json({ total, perStatOk, totalOk });
}
