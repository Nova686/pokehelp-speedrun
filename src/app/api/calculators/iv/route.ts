import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { level, stat, base, ev, nature } = await req.json();

  const L = Number(level) || 1;
  const S = Number(stat) || 0;
  const B = Number(base) || 0;
  const EV = Number(ev) || 0;
  const N = Number(nature) || 1;

  const unNatured = S / N;
  const inner = Math.round(unNatured - 5);
  const ivApprox = Math.round(((inner * 100) / L) - (2 * B) - (EV / 4));

  const iv = Math.min(31, Math.max(0, ivApprox));

  return NextResponse.json({ iv });
}
