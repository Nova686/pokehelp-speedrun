"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type StatKind = "hp" | "other";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function calcStat(base: number, iv: number, ev: number, level: number, nature: number, kind: StatKind) {
  if (kind === "hp") {
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  }
  const pre = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  return Math.floor(pre * nature);
}

export default function IVCalculatorPage() {
  const [kind, setKind] = useState<StatKind>("hp");
  const [base, setBase] = useState<number | "">("");
  const [level, setLevel] = useState(50);
  const [ev, setEv] = useState(0);
  const [nature, setNature] = useState(1);
  const [observed, setObserved] = useState<number | "">("");

  const result = useMemo(() => {
    const b = typeof base === "number" ? base : NaN;
    const o = typeof observed === "number" ? observed : NaN;
    if (!Number.isFinite(b) || !Number.isFinite(o)) return { list: [] as number[], min: null as number | null, max: null as number | null };
    const lvl = clamp(Number(level), 1, 100);
    const evv = clamp(Number(ev), 0, 252);
    const nat = Number(nature);
    const list: number[] = [];
    for (let iv = 0; iv <= 31; iv++) {
      const s = calcStat(b, iv, evv, lvl, nat, kind);
      if (s === o) list.push(iv);
    }
    if (list.length === 0) return { list, min: null, max: null };
    return { list, min: list[0], max: list[list.length - 1] };
  }, [base, observed, level, ev, nature, kind]);

  const unique = result.list.length === 1 ? result.list[0] : null;

  return (
    <main className="py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Calculateur d’IV</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Tous les calculateurs</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Stat</label>
              <select
                value={kind}
                onChange={e => setKind(e.target.value as StatKind)}
                className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
              >
                <option value="hp">PV</option>
                <option value="other">Atk/Def/SpA/SpD/Vit</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Base</label>
              <input
                type="number"
                min={1}
                value={base}
                onChange={e => setBase(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
                placeholder="Ex: 78"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Niveau</label>
              <input
                type="number"
                min={1}
                max={100}
                value={level}
                onChange={e => setLevel(Number(e.target.value))}
                className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">EV</label>
              <input
                type="number"
                min={0}
                max={252}
                step={4}
                value={ev}
                onChange={e => setEv(Number(e.target.value))}
                className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Nature</label>
              <select
                value={nature}
                onChange={e => setNature(Number(e.target.value))}
                className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
              >
                <option value={1}>Neutre (×1.0)</option>
                <option value={1.1}>Positive (×1.1)</option>
                <option value={0.9}>Négative (×0.9)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">Stat observée</label>
              <input
                type="number"
                min={1}
                value={observed}
                onChange={e => setObserved(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
                placeholder="Ex: 156"
              />
            </div>
          </div>

          <div className="mt-6 rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            {result.list.length === 0 ? (
              <div className="text-sm text-red-300">Aucun IV 0–31 ne correspond. Vérifiez base, EV, nature et stat observée.</div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm">
                  IV possibles: <span className="font-semibold">{result.min}{result.min !== result.max ? `–${result.max}` : ""}</span>
                </div>
                {unique !== null ? (
                  <div className="text-sm">IV déterminé: <span className="font-semibold">{unique}</span></div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.list.map(v => (
                      <span key={v} className="rounded border border-white/10 bg-[#121212] px-2 py-1 text-xs">{v}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
