import prisma from "./prisma";

export type Session = { user: { id: string; name?: string | null; email?: string | null } } | null;

function getCookieValue(cookieHeader: string | null, key: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map(s => s.trim());
  for (const p of parts) {
    const [k, ...rest] = p.split("=");
    if (k === key) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export async function getServerSessionFromHeaders(headers: Headers): Promise<Session> {
  const cookieHeader = headers.get("cookie");
  const cookieUid = getCookieValue(cookieHeader, "uid");
  const headerUid = headers.get("x-user-id");
  const id = cookieUid || headerUid || null;
  if (!id) return null;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return { user: { id: user.id, name: user.name ?? null, email: user.email ?? null } };
}
