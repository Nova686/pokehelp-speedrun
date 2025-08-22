import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession().catch(() => null);
  if (!session?.user?.id) return NextResponse.json({ loggedIn: false, user: null });
  return NextResponse.json({ loggedIn: true, user: { id: session.user.id, name: session.user.name || null } });
}
