import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { hpMax, hpCurrent, ballRate, statusMult, baseRate } = await req.json();

  const HM = +hpMax || 1;
  const HC = Math.min(+hpCurrent || 0, HM);
  const BR = +ballRate || 1;
  const SM = +statusMult || 1;
  const BASE = +baseRate || 1;

  const a = ((3*HM - 2*HC) * BASE * BR) / (3*HM) * SM;
  const p = Math.max(0, Math.min(1, a / 255));
  const percent = +(p * 100).toFixed(2);

  return NextResponse.json({ percent });
}
