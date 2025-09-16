"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

function returnPower(friendship: number) {
  const f = Math.max(0, Math.min(255, friendship));
  return Math.floor(f / 2.5);
}
function frustrationPower(friendship: number) {
  const f = Math.max(0, Math.min(255, friendship));
  return Math.floor((255 - f) / 2.5);
}

export default function HappinessPage() {
  const [friendship, setFriendship] = useState(160);
  const returnBP = useMemo(() => returnPower(friendship), [friendship]);
  const frustrationBP = useMemo(() => frustrationPower(friendship), [friendship]);
  const evolvesAt = 220;
  const need = Math.max(0, evolvesAt - friendship);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Calculateur de bonheur</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Retour</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <label className="mb-1 block text-sm text-gray-300">Bonheur (0–255)</label>
          <input type="range" min={0} max={255} value={friendship} onChange={e => setFriendship(Number(e.target.value))} className="w-full"/>
          <div className="mt-2 text-gray-200">Valeur actuelle: <span className="font-semibold">{friendship}</span></div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded border border-white/10 bg-[#0f0f0f] p-4">
              <div className="text-sm text-gray-300">Retour</div>
              <div className="text-xl font-semibold">{returnBP}</div>
            </div>
            <div className="rounded border border-white/10 bg-[#0f0f0f] p-4">
              <div className="text-sm text-gray-300">Frustration</div>
              <div className="text-xl font-semibold">{frustrationBP}</div>
            </div>
          </div>

          <div className="mt-6 rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="text-sm">Évolution par bonheur</div>
            {friendship >= evolvesAt ? (
              <div className="text-green-400">Prêt : l’évolution se déclenche au prochain niveau (≥ {evolvesAt}).</div>
            ) : (
              <div>Manque <span className="font-semibold">{need}</span> points pour atteindre {evolvesAt}.</div>
            )}
            <p className="mt-2 text-xs text-gray-400">Note: les gains exacts dépendent du jeu, de la clochette, des pas, objets, etc.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
