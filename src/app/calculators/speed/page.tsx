"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Nature = "neutral" | "plus" | "minus";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statOther(base: number, iv: number, ev: number, level: number, nature: number) {
  const pre = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  return Math.floor(pre * nature);
}

function stageMul(stage: number) {
  if (stage >= 0) return (2 + stage) / 2;
  return 2 / (2 - stage);
}

export default function SpeedComparePage() {
  const [you, setYou] = useState({ base: 100, iv: 31, ev: 252, level: 50, nature: "plus" as Nature, stage: 0, item: 1 });
  const [opp, setOpp] = useState({ base: 100, iv: 31, ev: 252, level: 50, nature: "neutral" as Nature, stage: 0, item: 1 });

  const calc = useMemo(() => {
    const natVal = (n: Nature) => (n === "plus" ? 1.1 : n === "minus" ? 0.9 : 1);
    const youBase = statOther(you.base, you.iv, you.ev, clamp(you.level, 1, 100), natVal(you.nature));
    const oppBase = statOther(opp.base, opp.iv, opp.ev, clamp(opp.level, 1, 100), natVal(opp.nature));
    const youFinal = Math.floor(youBase * stageMul(you.stage) * you.item);
    const oppFinal = Math.floor(oppBase * stageMul(opp.stage) * opp.item);
    return { youFinal, oppFinal, outspeed: youFinal > oppFinal, tie: youFinal === oppFinal };
  }, [you, opp]);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Vitesse / Outspeed</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Tous les calculateurs</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded border border-white/10 bg-[#0f0f0f] p-4">
              <div className="mb-2 text-sm font-semibold text-gray-200">Vous</div>
              <label className="mb-1 block text-xs text-gray-300">Base</label>
              <input type="number" min={1} value={you.base} onChange={e => setYou({ ...you, base: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
              <div className="mt-2 grid gap-2 grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-300">IV</label>
                  <input type="number" min={0} max={31} value={you.iv} onChange={e => setYou({ ...you, iv: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-300">EV</label>
                  <input type="number" min={0} max={252} step={4} value={you.ev} onChange={e => setYou({ ...you, ev: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Niv.</label>
                  <input type="number" min={1} max={100} value={you.level} onChange={e => setYou({ ...you, level: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                </div>
              </div>
              <div className="mt-2 grid gap-2 grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Nature</label>
                  <select value={you.nature} onChange={e => setYou({ ...you, nature: e.target.value as Nature })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100">
                    <option value="minus">Négative</option>
                    <option value="neutral">Neutre</option>
                    <option value="plus">Positive</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Boost</label>
                  <input type="number" min={-6} max={6} value={you.stage} onChange={e => setYou({ ...you, stage: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Objet</label>
                  <select value={you.item} onChange={e => setYou({ ...you, item: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100">
                    <option value={1}>Aucun (×1.0)</option>
                    <option value={1.5}>Mouchoir Choix (×1.5)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded border border-white/10 bg-[#0f0f0f] p-4">
              <div className="mb-2 text-sm font-semibold text-gray-200">Adversaire</div>
              <label className="mb-1 block text-xs text-gray-300">Base</label>
              <input type="number" min={1} value={opp.base} onChange={e => setOpp({ ...opp, base: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
              <div className="mt-2 grid gap-2 grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-300">IV</label>
                  <input type="number" min={0} max={31} value={opp.iv} onChange={e => setOpp({ ...opp, iv: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-300">EV</label>
                  <input type="number" min={0} max={252} step={4} value={opp.ev} onChange={e => setOpp({ ...opp, ev: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Niv.</label>
                  <input type="number" min={1} max={100} value={opp.level} onChange={e => setOpp({ ...opp, level: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                </div>
              </div>
              <div className="mt-2 grid gap-2 grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Nature</label>
                  <select value={opp.nature} onChange={e => setOpp({ ...opp, nature: e.target.value as Nature })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100">
                    <option value="minus">Négative</option>
                    <option value="neutral">Neutre</option>
                    <option value="plus">Positive</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Boost</label>
                  <input type="number" min={-6} max={6} value={opp.stage} onChange={e => setOpp({ ...opp, stage: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Objet</label>
                  <select value={opp.item} onChange={e => setOpp({ ...opp, item: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100">
                    <option value={1}>Aucun (×1.0)</option>
                    <option value={1.5}>Mouchoir Choix (×1.5)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-sm">Votre Vitesse</div>
                <div className="text-xl font-semibold">{calc.youFinal}</div>
              </div>
              <div>
                <div className="text-sm">Vitesse adverse</div>
                <div className="text-xl font-semibold">{calc.oppFinal}</div>
              </div>
              <div className="flex items-center">
                {calc.tie ? (
                  <span className="rounded bg-white/10 px-3 py-1 text-sm">Speed tie</span>
                ) : calc.outspeed ? (
                  <span className="rounded bg-green-600/80 px-3 py-1 text-sm">Vous outspeed</span>
                ) : (
                  <span className="rounded bg-red-600/80 px-3 py-1 text-sm">Vous êtes plus lent</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
