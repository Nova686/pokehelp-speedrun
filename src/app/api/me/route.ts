import { getServerSessionFromHeaders } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSessionFromHeaders(req.headers).catch(() => null);
  if (!session?.user?.id) return new Response(JSON.stringify({ loggedIn: false, user: null }), { status: 200 });

  return new Response(
    JSON.stringify({
      loggedIn: true,
      user: { id: session.user.id, name: session.user.name ?? null, email: session.user.email ?? null },
    }),
    { status: 200 }
  );
}
