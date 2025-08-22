import { NextResponse } from "next/server";

function baseDamage(level:number, power:number, atk:number, defn:number){
  return Math.floor(Math.floor(Math.floor((2*level)/5 + 2) * power * (atk/defn)) / 50) + 2;
}

export async function POST(req: Request) {
  const { level, power, atk, defn, stab, eff, crit } = await req.json();

  const L = +level || 1;
  const P = +power || 0;
  const A = +atk || 1;
  const D = +defn || 1;
  const STAB = stab ? 1.5 : 1;
  const EFF = +eff || 1;
  const CRIT = crit ? 1.5 : 1;

  const base = baseDamage(L, P, A, D);
  const min = Math.floor(base * 0.85 * STAB * EFF * CRIT);
  const max = Math.floor(base * 1.00 * STAB * EFF * CRIT);

  const steps: number[] = [];
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    steps.push(Math.floor(min + (max - min) * t));
  }

  return NextResponse.json({ min, max, steps });
}
