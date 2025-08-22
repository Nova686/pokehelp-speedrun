import prisma from "@/lib/prisma";
import { getServerSessionFromHeaders } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const route = await prisma.speedrunRoute.findUnique({
    where: { id: params.id },
    include: { user: true, ratings: true },
  });
  if (!route) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  return new Response(JSON.stringify(route), { status: 200 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionFromHeaders(req.headers);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const existing = await prisma.speedrunRoute.findUnique({ where: { id: params.id } });
  if (!existing) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  if (existing.createdBy !== session.user.id)
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

  const { title, description, steps } = await req.json();

  const updated = await prisma.speedrunRoute.update({
    where: { id: params.id },
    data: { title, description, steps },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionFromHeaders(req.headers);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const existing = await prisma.speedrunRoute.findUnique({ where: { id: params.id } });
  if (!existing) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  if (existing.createdBy !== session.user.id)
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

  await prisma.speedrunRoute.delete({ where: { id: params.id } });
  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
}
