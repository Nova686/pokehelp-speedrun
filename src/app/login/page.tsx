"use client";

import { useSession } from "@/lib/auth-client";
import { signInGoogle, signInDiscord } from "@/lib/auth-client";

export default function LoginPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <p className="p-6">Chargement…</p>;
  if (session) return <p className="p-6">Déjà connecté.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-3">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <button
        onClick={() => signInGoogle({ callbackURL: "/speedrun" })}
        className="bg-blue-600 text-white px-4 py-2 rounded w-64"
      >
        Continuer avec Google
      </button>
      <button
        onClick={() => signInDiscord({ callbackURL: "/speedrun" })}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-64"
      >
        Continuer avec Discord
      </button>
    </div>
  );
}
