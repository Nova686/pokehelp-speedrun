import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const route = await prisma.speedrunRoute.findUnique({
    where: { id: params.id },
    include: { ratings: true, user: true }
  });
  if (!route) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(route);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.speedrunRoute.findUnique({ where: { id: params.id } });
  if (!existing || existing.createdBy !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, steps } = body;

  const updated = await prisma.speedrunRoute.update({
    where: { id: params.id },
    data: { title, description, steps }
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.speedrunRoute.findUnique({ where: { id: params.id } });
  if (!existing || existing.createdBy !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.speedrunRoute.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
