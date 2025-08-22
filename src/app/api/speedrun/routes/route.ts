import prisma from "@/lib/prisma";
import { getServerSessionFromHeaders } from "@/lib/auth";

export async function GET(req: Request) {
  const routes = await prisma.speedrunRoute.findMany({
    include: { user: true, ratings: true },
  });
  return new Response(JSON.stringify(routes), { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSessionFromHeaders(req.headers);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { title, description, steps } = await req.json();

  const newRoute = await prisma.speedrunRoute.create({
    data: {
      title,
      description,
      steps,
      createdBy: session.user.id,
    },
    include: { user: true },
  });

  return new Response(JSON.stringify(newRoute), { status: 200 });
}
