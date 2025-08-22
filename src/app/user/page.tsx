"use client";

import { useSession, signOut } from "@/lib/auth-client";

export default function UserPage() {
  const { data: session, isPending, error, refetch } = useSession();

  if (isPending) return <p className="p-6">Chargement…</p>;
  if (error) return <p className="p-6 text-red-600">Erreur: {String(error)}</p>;
  if (!session) return <p className="p-6">Vous devez être connecté.</p>;

  const user = session.user;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-bold">Mon compte</h1>
      <div>Nom : {user?.name ?? "—"}</div>
      <div>Email : {user?.email ?? "—"}</div>
      <div>Id : {user?.id ?? "—"}</div>

      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => signOut({ fetchOptions: { onSuccess: () => location.assign("/") } })}
      >
        Se déconnecter
      </button>
    </div>
  );
}
