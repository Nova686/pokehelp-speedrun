"use client";
import Link from "next/link";

export default function CalculatorsHome() {
  return (
    <main className="py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Calculateurs</h1>
        <p className="mb-8 text-gray-300">Outils rapides et précis pour vos runs.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/calculators/iv" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Calculateur d’IV</h2>
            <p className="mt-1 text-sm text-gray-300">Déduire les IV possibles.</p>
          </Link>
          <Link href="/calculators/damage" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Calculateur de dégâts</h2>
            <p className="mt-1 text-sm text-gray-300">Plage de dégâts et % PV.</p>
          </Link>
          <Link href="/calculators/ranges" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Rolls de dégâts (16)</h2>
            <p className="mt-1 text-sm text-gray-300">Affiche les 16 jets 85–100%.</p>
          </Link>
          <Link href="/calculators/stats" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Stats finales</h2>
            <p className="mt-1 text-sm text-gray-300">Bases, IV/EV, niveau, nature.</p>
          </Link>
          <Link href="/calculators/ev" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">EV requises</h2>
            <p className="mt-1 text-sm text-gray-300">Atteindre une stat cible.</p>
          </Link>
          <Link href="/calculators/speed" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Vitesse / Outspeed</h2>
            <p className="mt-1 text-sm text-gray-300">Compare deux vitesses.</p>
          </Link>
          <Link href="/calculators/hidden-power" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Puissance Cachée</h2>
            <p className="mt-1 text-sm text-gray-300">Type (Gen 3–6) depuis IV.</p>
          </Link>
          <Link href="/calculators/catch" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Capture</h2>
            <p className="mt-1 text-sm text-gray-300">Probabilité précise (Gen 3+).</p>
          </Link>
          <Link href="/calculators/encounters" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Rencontres</h2>
            <p className="mt-1 text-sm text-gray-300">Essais nécessaires à X%.</p>
          </Link>
          <Link href="/calculators/happiness" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">Bonheur</h2>
            <p className="mt-1 text-sm text-gray-300">Retour/Frustration & évolution.</p>
          </Link>
          <Link href="/calculators/sos" className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
            <h2 className="text-lg font-semibold text-white">SOS / Rerolls</h2>
            <p className="mt-1 text-sm text-gray-300">Proba avec rerolls & chaîne.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
