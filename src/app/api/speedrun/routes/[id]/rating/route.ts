import prisma from "@/lib/prisma";
import { getServerSessionFromHeaders } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSessionFromHeaders(req.headers);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { value } = await req.json();
  if (typeof value !== "number" || value < 1 || value > 5) {
    return new Response(JSON.stringify({ error: "Invalid value" }), { status: 400 });
  }

  const rating = await prisma.rating.upsert({
    where: { userId_routeId: { userId: session.user.id, routeId: params.id } },
    update: { value },
    create: { userId: session.user.id, routeId: params.id, value },
  });

  return new Response(JSON.stringify(rating), { status: 200 });
}
