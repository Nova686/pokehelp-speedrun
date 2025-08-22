import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const routes = await prisma.speedrunRoute.findMany({
    include: {
      ratings: true
    },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(routes);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, steps } = body;

  const route = await prisma.speedrunRoute.create({
    data: {
      title,
      description,
      steps,
      createdBy: session.user.id
    }
  });

  return NextResponse.json(route);
}
