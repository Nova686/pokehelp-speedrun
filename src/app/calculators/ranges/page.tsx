"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

function calcBase(level: number, power: number, atk: number, def: number) {
  const t = Math.floor((2 * level) / 5) + 2;
  const num = Math.floor(t * power * atk);
  const base = Math.floor(Math.floor(num / Math.max(1, def)) / 50) + 2;
  return base;
}

export default function RangesPage() {
  const [level, setLevel] = useState(50);
  const [power, setPower] = useState(80);
  const [atk, setAtk] = useState(120);
  const [def, setDef] = useState(100);
  const [stab, setStab] = useState(true);
  const [typeEff, setTypeEff] = useState(1);
  const [crit, setCrit] = useState(false);
  const [burn, setBurn] = useState(false);
  const [other, setOther] = useState(1);
  const [targetHP, setTargetHP] = useState<number | "">("");

  const rows = useMemo(() => {
    const base = calcBase(level, power, atk, def);
    const critMul = crit ? 1.5 : 1;
    const burnMul = burn ? 0.5 : 1;
    const stabMul = stab ? 1.5 : 1;
    const fixed = stabMul * typeEff * critMul * burnMul * Math.max(0, other || 1);
    const out: { roll: number; dmg: number; pct?: number }[] = [];
    for (let r = 85; r <= 100; r++) {
      const dmg = Math.floor(base * fixed * (r / 100));
      const pct = typeof targetHP === "number" && targetHP > 0 ? Math.round((dmg / targetHP) * 1000) / 10 : undefined;
      out.push({ roll: r, dmg, pct });
    }
    return out;
  }, [level, power, atk, def, stab, typeEff, crit, burn, other, targetHP]);

  const min = rows[0]?.dmg ?? 0;
  const max = rows[rows.length - 1]?.dmg ?? 0;

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Rolls de dégâts (16 valeurs)</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Retour</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Niveau</label>
              <input type="number" min={1} max={100} value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Puissance</label>
              <input type="number" min={1} value={power} onChange={e => setPower(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">ATK / SPA</label>
              <input type="number" min={1} value={atk} onChange={e => setAtk(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">DEF / SPD</label>
              <input type="number" min={1} value={def} onChange={e => setDef(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Efficacité</label>
              <select value={typeEff} onChange={e => setTypeEff(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                {[0,0.25,0.5,1,2,4].map(v => <option key={v} value={v}>{v}×</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Multiplicateur “autres”</label>
              <input type="number" step="0.01" min={0} value={other} onChange={e => setOther(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
              <p className="mt-1 text-xs text-gray-400">Ex.: terrain, objets, talents…</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={stab} onChange={e => setStab(e.target.checked)} /> STAB (×1.5)
            </label>
            <label className="flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={crit} onChange={e => setCrit(e.target.checked)} /> Coup critique (×1.5)
            </label>
            <label className="flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={burn} onChange={e => setBurn(e.target.checked)} /> Brûlure (×0.5)
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">PV de la cible (optionnel)</label>
            <input type="number" min={1} value={typeof targetHP === "number" ? targetHP : ""} onChange={e => setTargetHP(e.target.value === "" ? "" : Number(e.target.value))} className="w-full max-w-xs rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"/>
          </div>

          <div className="rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="mb-2 text-sm">Plage totale</div>
            <div className="text-lg font-semibold">{min} – {max}{typeof targetHP === "number" && targetHP > 0 ? ` (${Math.round(min/targetHP*1000)/10}% – ${Math.round(max/targetHP*1000)/10}%)` : ""}</div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {rows.map(r => (
                <div key={r.roll} className="rounded bg-[#141414] px-3 py-2">
                  <div className="text-xs text-gray-400">{r.roll}%</div>
                  <div className="text-sm font-semibold">{r.dmg}{typeof r.pct === "number" ? ` (${r.pct}%)` : ""}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
