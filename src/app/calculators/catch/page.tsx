"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

function captureChanceGen3Plus(maxHP: number, hp: number, rate: number, ball: number, status: number) {
  const a = Math.floor((((3 * maxHP - 2 * hp) * rate * ball) / (3 * maxHP)) * status);
  if (a >= 255) return 1;
  if (a <= 0) return 0;
  const b = Math.floor(1048560 / Math.sqrt(Math.sqrt(16711680 / a)));
  const p = Math.pow(b / 65535, 4);
  return clamp01(p);
}

const BALLS: { label: string; m: number }[] = [
  { label: "Poké / Luxe / Soin (×1.0)", m: 1 },
  { label: "Super (×1.5)", m: 1.5 },
  { label: "Hyper (×2.0)", m: 2 },
  { label: "Rapide (×4.0)", m: 4 },
  { label: "Sombre (×3.0)", m: 3 },
  { label: "Au filet (×3.5)", m: 3.5 },
  { label: "Custom…", m: -1 }
];

const STATUS: { label: string; m: number }[] = [
  { label: "Aucun (×1.0)", m: 1 },
  { label: "Paralysie/Brûlure/Poison (×1.5)", m: 1.5 },
  { label: "Sommeil/Gel (×2.0)", m: 2 }
];

export default function CatchPage() {
  const [maxHP, setMaxHP] = useState(100);
  const [hp, setHP] = useState(1);
  const [rate, setRate] = useState(45);
  const [ballSel, setBallSel] = useState(BALLS[0].label);
  const [ballCustom, setBallCustom] = useState(1);
  const [statusSel, setStatusSel] = useState(STATUS[0].label);

  const ball = useMemo(() => {
    const found = BALLS.find(b => b.label === ballSel);
    return found && found.m > 0 ? found.m : ballCustom;
  }, [ballSel, ballCustom]);

  const status = useMemo(() => STATUS.find(s => s.label === statusSel)!.m, [statusSel]);

  const res = useMemo(() => {
    const mhp = Math.max(1, maxHP);
    const chp = Math.min(Math.max(1, hp), mhp);
    const r = Math.max(1, Math.min(255, rate));
    const p = captureChanceGen3Plus(mhp, chp, r, ball, status);
    return { p, expectedBalls: p > 0 ? 1 / p : Infinity };
  }, [maxHP, hp, rate, ball, status]);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Calculateur de capture</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Retour</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-gray-300">PV max</label>
              <input type="number" min={1} value={maxHP} onChange={e => setMaxHP(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">PV actuels</label>
              <input type="number" min={1} value={hp} onChange={e => setHP(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Taux de capture</label>
              <input type="number" min={1} max={255} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Ball</label>
              <select value={ballSel} onChange={e => setBallSel(e.target.value)} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                {BALLS.map(b => <option key={b.label} value={b.label}>{b.label}</option>)}
              </select>
              {ballSel === "Custom…" && (
                <input type="number" step="0.1" min={0.1} value={ballCustom} onChange={e => setBallCustom(Number(e.target.value))} className="mt-2 w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Statut</label>
              <select value={statusSel} onChange={e => setStatusSel(e.target.value)} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                {STATUS.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="text-sm">Probabilité de capture (lancer unique)</div>
            <div className="text-2xl font-semibold">{(res.p * 100).toFixed(2)}%</div>
            <div className="mt-1 text-sm text-gray-400">Nombre de Balls attendu: {res.expectedBalls === Infinity ? "∞" : res.expectedBalls.toFixed(2)}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
