import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { POKEMON_GAMES } from "@/lib/pokemon-games";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.speedrunRoute.findMany({
    where: { game: { not: null } },
    select: { game: true },
    distinct: ["game"],
  });

  const fromDb = rows.map(r => (r.game ?? "").trim()).filter(Boolean);
  const merged = Array.from(new Set([...POKEMON_GAMES, ...fromDb]))
    .sort((a, b) => a.localeCompare(b, "fr"));

  return NextResponse.json(merged);
}
