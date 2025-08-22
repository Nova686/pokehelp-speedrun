import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { level, power, atk, defn, stab, eff, crit } = await req.json();

  const L = +level || 1;
  const P = +power || 0;
  const A = +atk || 1;
  const D = +defn || 1;
  const STAB = stab ? 1.5 : 1;
  const EFF = +eff || 1;
  const CRIT = crit ? 1.5 : 1;

  const base = Math.floor(Math.floor(Math.floor((2 * L) / 5 + 2) * P * (A / D)) / 50) + 2;
  const min = Math.floor(base * 0.85 * STAB * EFF * CRIT);
  const max = Math.floor(base * 1.0  * STAB * EFF * CRIT);

  return NextResponse.json({ min, max });
}
