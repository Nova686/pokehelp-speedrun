"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

function atLeastOne(probSingle: number, trials: number) {
  if (probSingle <= 0) return 0;
  return 1 - Math.pow(1 - probSingle, Math.max(0, trials));
}

export default function SOSPage() {
  const [denom, setDenom] = useState(4096);
  const [baseRerolls, setBaseRerolls] = useState(0);
  const [charm, setCharm] = useState(false);
  const [chain, setChain] = useState(30);

  const pPerCall = useMemo(() => {
    const n = Math.max(1, denom);
    const rerolls = baseRerolls + (charm ? 2 : 0);
    const p = 1 - Math.pow(1 - 1 / n, Math.max(0, rerolls) + 1);
    return p;
  }, [denom, baseRerolls, charm]);

  const pChain = useMemo(() => atLeastOne(pPerCall, chain), [pPerCall, chain]);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">SOS / Rerolls</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Retour</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Odds de base (1/N)</label>
              <input type="number" min={1} value={denom} onChange={e => setDenom(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Rerolls supplémentaires</label>
              <input type="number" min={0} value={baseRerolls} onChange={e => setBaseRerolls(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
              <p className="mt-1 text-xs text-gray-400">Chaîne SOS: entrez la valeur de votre bracket.</p>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-gray-200">
                <input type="checkbox" checked={charm} onChange={e => setCharm(e.target.checked)} /> Charme Chroma (+2)
              </label>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Longueur de chaîne</label>
              <input type="number" min={0} value={chain} onChange={e => setChain(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
          </div>

          <div className="rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="text-sm">Proba par appel</div>
            <div className="text-xl font-semibold">{(pPerCall * 100).toFixed(3)}%</div>
            <div className="mt-2 text-sm">Proba d’au moins un shiny sur {chain} appels: <span className="font-semibold">{(pChain * 100).toFixed(2)}%</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
