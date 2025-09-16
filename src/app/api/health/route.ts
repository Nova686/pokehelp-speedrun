import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ db: "ok" });
  } catch (e) {
    console.error("HEALTH DB ERROR:", e);
    return new Response(JSON.stringify({ db: "error", message: String(e) }), { status: 500 });
  }
}
