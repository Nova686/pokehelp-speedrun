"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Kind = "hp" | "other";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statHP(base: number, iv: number, ev: number, level: number) {
  return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

function statOther(base: number, iv: number, ev: number, level: number, nature: number) {
  const pre = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  return Math.floor(pre * nature);
}

export default function EVRequiredPage() {
  const [kind, setKind] = useState<Kind>("other");
  const [base, setBase] = useState<number | "">("");
  const [iv, setIv] = useState(31);
  const [level, setLevel] = useState(50);
  const [nature, setNature] = useState(1);
  const [target, setTarget] = useState<number | "">("");

  const res = useMemo(() => {
    const b = typeof base === "number" ? base : NaN;
    const t = typeof target === "number" ? target : NaN;
    if (!Number.isFinite(b) || !Number.isFinite(t)) return { ev: null as number | null, reachable: false, minStat: null as number | null };
    const L = clamp(level, 1, 100);
    for (let ev = 0; ev <= 252; ev += 4) {
      const s = kind === "hp" ? statHP(b, iv, ev, L) : statOther(b, iv, ev, L, nature);
      if (s >= t) return { ev, reachable: true, minStat: s };
    }
    return { ev: null, reachable: false, minStat: null };
  }, [kind, base, iv, level, nature, target]);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">EV requises pour une stat cible</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Tous les calculateurs</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Stat</label>
              <select value={kind} onChange={e => setKind(e.target.value as Kind)} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                <option value="hp">PV</option>
                <option value="other">Atk/Def/SpA/SpD/Vit</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Base</label>
              <input type="number" min={1} value={base} onChange={e => setBase(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">IV</label>
              <input type="number" min={0} max={31} value={iv} onChange={e => setIv(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Niveau</label>
              <input type="number" min={1} max={100} value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            {kind === "other" && (
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-gray-300">Nature</label>
                <select value={nature} onChange={e => setNature(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                  <option value={1}>Neutre (×1.0)</option>
                  <option value={1.1}>Positive (×1.1)</option>
                  <option value={0.9}>Négative (×0.9)</option>
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-gray-300">Stat cible</label>
              <input type="number" min={1} value={target} onChange={e => setTarget(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
          </div>

          <div className="mt-6 rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            {res.ev === null ? (
              <div className="text-sm text-red-300">Objectif inatteignable avec 252 EV. Ajustez base/IV/nature/niveau.</div>
            ) : (
              <div className="text-sm">
                Minimum d’EV requis: <span className="font-semibold">{res.ev}</span> {res.minStat !== null && <span className="text-gray-400">→ stat obtenue {res.minStat}</span>}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
