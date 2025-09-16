"use client";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

export default function UserPage() {
  const { data: session, isPending, error } = useSession();

  if (isPending) return <main className="p-6 text-gray-300">Chargement…</main>;
  if (error) return <main className="p-6 text-red-400">Erreur: {String(error)}</main>;

  if (!session) {
    return (
      <main className="p-6">
        <h1 className="mb-3 text-2xl font-bold text-white">Mon compte</h1>
        <p className="text-gray-300">Vous n’êtes pas connecté.</p>
        <Link href="/login" className="mt-4 inline-block rounded bg-white/10 px-4 py-2 text-white">Se connecter</Link>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="mb-3 text-2xl font-bold text-white">Mon compte</h1>
      <div className="rounded-xl border border-white/10 bg-[#121212] p-5 text-gray-200">
        <div><span className="text-gray-400">ID:</span> {session.user.id}</div>
        {session.user.name && <div><span className="text-gray-400">Nom:</span> {session.user.name}</div>}
        {session.user.email && <div><span className="text-gray-400">Email:</span> {session.user.email}</div>}
        <button
          className="mt-5 rounded bg-red-600 px-4 py-2 text-white"
          onClick={() => signOut({ onSuccess: () => location.assign("/") })}
        >
          Se déconnecter
        </button>
      </div>
    </main>
  );
}
