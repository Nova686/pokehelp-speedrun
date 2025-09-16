"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

function encountersFor(targetProb: number, perEncounterProb: number) {
  if (perEncounterProb <= 0) return Infinity;
  if (perEncounterProb >= 1) return 1;
  const n = Math.log(1 - targetProb) / Math.log(1 - perEncounterProb);
  return Math.ceil(n);
}

export default function EncountersPage() {
  const [denom, setDenom] = useState(4096);
  const [rerolls, setRerolls] = useState(0);
  const [target, setTarget] = useState(0.9);

  const pSingle = useMemo(() => {
    const base = 1 / Math.max(1, denom);
    return 1 - Math.pow(1 - base, Math.max(0, rerolls) + 1);
  }, [denom, rerolls]);

  const need = useMemo(() => encountersFor(target, pSingle), [target, pSingle]);
  const checkpoints = [0.25, 0.5, 0.75, 0.9, 0.95, 0.99];

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Calculateur de rencontres</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Retour</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Odds (1/N)</label>
              <input type="number" min={1} value={denom} onChange={e => setDenom(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Rerolls par rencontre</label>
              <input type="number" min={0} value={rerolls} onChange={e => setRerolls(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
              <p className="mt-1 text-xs text-gray-400">Ex.: Charme Chroma +2, SOS etc.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Objectif</label>
              <select value={target} onChange={e => setTarget(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                {[0.5,0.75,0.9,0.95,0.99].map(v => <option key={v} value={v}>{Math.round(v*100)}%</option>)}
              </select>
            </div>
          </div>

          <div className="rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="text-sm">Proba par rencontre</div>
            <div className="text-xl font-semibold">{(pSingle * 100).toFixed(3)}%</div>
            <div className="mt-2 text-sm">Rencontres nécessaires pour atteindre {Math.round(target*100)}% : <span className="font-semibold">{need === Infinity ? "∞" : need}</span></div>
          </div>

          <div className="rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="mb-2 text-sm">Repères</div>
            <ul className="grid gap-2 sm:grid-cols-3">
              {checkpoints.map(c => (
                <li key={c} className="rounded bg-[#141414] px-3 py-2">
                  <div className="text-xs text-gray-400">{Math.round(c*100)}%</div>
                  <div className="text-sm font-semibold">{encountersFor(c, pSingle)}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
