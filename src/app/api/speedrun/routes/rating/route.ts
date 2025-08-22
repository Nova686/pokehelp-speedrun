import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { routeId, value } = await req.json();
  if (value < 1 || value > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  const rating = await prisma.rating.upsert({
    where: { userId_routeId: { userId: session.user.id, routeId } },
    update: { value },
    create: { userId: session.user.id, routeId, value }
  });

  return NextResponse.json(rating);
}
