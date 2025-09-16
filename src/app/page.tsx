"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="py-16">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">PokéHelp</h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-300">Accélérez vos speedruns Pokémon avec des routes optimisées.</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/speedrun" className="rounded bg-white/10 px-6 py-3 font-semibold hover:bg-white/20">Commencer</Link>
          <Link href="/login" className="rounded border border-white/20 px-6 py-3 font-semibold text-gray-200">Connexion</Link>
        </div>
      </section>
    </main>
  );
}
