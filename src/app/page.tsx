"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { signInGoogle } from "@/lib/auth-client";

export default function LandingPage() {
  const { data: session, isPending } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">PokéHelp Speedrun</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Accélérez vos speedruns Pokémon avec des routes optimisées et des calculateurs intégrés.
        </p>
        {!isPending && !session ? (
          <button
            onClick={() => signInGoogle({ callbackURL: "/speedrun", errorCallbackURL: "/login?error=1" })}
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Se connecter avec Google
          </button>
        ) : session ? (
          <Link
            href="/speedrun"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Accéder à la plateforme
          </Link>
        ) : (
          <p>Chargement...</p>
        )}
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-3">Calculateurs avancés</h2>
          <p className="text-gray-600">
            Calculez les IV, EV, dégâts et plus encore avec nos outils rapides et fiables.
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-3">Routes optimisées</h2>
          <p className="text-gray-600">
            Parcourez des routes de speedrun créées par la communauté et partagez les vôtres.
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-3">Notation et suivi</h2>
          <p className="text-gray-600">
            Notez les routes et suivez vos performances en un clic.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Rejoignez la communauté PokéHelp !</h2>
        <p className="mb-6">Commencez dès maintenant à optimiser vos runs Pokémon.</p>
        {!isPending && !session ? (
          <button
            onClick={() => signInGoogle({ callbackURL: "/speedrun", errorCallbackURL: "/login?error=1" })}
            className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Se connecter
          </button>
        ) : (
          <Link
            href="/speedrun"
            className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Accéder à la plateforme
          </Link>
        )}
      </section>
    </main>
  );
}
