import { NextResponse } from "next/server";

function hp(B:number, IV:number, EV:number, L:number){
  return Math.floor(((2*B + IV + Math.floor(EV/4)) * L)/100) + L + 10;
}
function stat(B:number, IV:number, EV:number, L:number, N:number){
  const raw = Math.floor(((2*B + IV + Math.floor(EV/4)) * L)/100) + 5;
  return Math.floor(raw * N);
}

export async function POST(req: Request) {
  const { level, bases, ivs, evs, nature } = await req.json();
  const L = +level || 1;
  const N = +nature || 1;

  const B = (bases || []).map((x:number)=>+x||0);
  const IV = (ivs || []).map((x:number)=>+x||0);
  const EV = (evs || []).map((x:number)=>+x||0);

  const out = {
    hp:  hp(B[0], IV[0], EV[0], L),
    atk: stat(B[1], IV[1], EV[1], L, N),
    def: stat(B[2], IV[2], EV[2], L, N),
    spa: stat(B[3], IV[3], EV[3], L, N),
    spd: stat(B[4], IV[4], EV[4], L, N),
    spe: stat(B[5], IV[5], EV[5], L, N),
  };

  return NextResponse.json(out);
}
