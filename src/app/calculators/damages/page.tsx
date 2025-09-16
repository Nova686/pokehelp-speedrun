"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function baseDamage(level: number, power: number, atk: number, def: number) {
  const l = Math.floor((2 * level) / 5) + 2;
  const core = Math.floor(Math.floor((l * power * atk) / def) / 50) + 2;
  return core;
}

function applyMods(base: number, stab: boolean, eff: number, burn: boolean, other: number, physical: boolean) {
  const stabM = stab ? 1.5 : 1;
  const burnM = burn && physical ? 0.5 : 1;
  const m = stabM * eff * burnM * other;
  return { min: Math.floor(base * m * 0.85), max: Math.floor(base * m) };
}

export default function DamageCalculatorPage() {
  const [level, setLevel] = useState(50);
  const [power, setPower] = useState(60);
  const [atk, setAtk] = useState(120);
  const [def, setDef] = useState(100);
  const [hp, setHp] = useState(300);
  const [stab, setStab] = useState(false);
  const [eff, setEff] = useState(1);
  const [burn, setBurn] = useState(false);
  const [physical, setPhysical] = useState(true);
  const [other, setOther] = useState(1);

  const output = useMemo(() => {
    const L = clamp(level, 1, 100);
    const P = Math.max(1, power);
    const A = Math.max(1, atk);
    const D = Math.max(1, def);
    const H = Math.max(1, hp);
    const base = baseDamage(L, P, A, D);
    const { min, max } = applyMods(base, stab, eff, burn, other, physical);
    const pmin = Math.min(100, Math.round((min / H) * 1000) / 10);
    const pmax = Math.min(100, Math.round((max / H) * 1000) / 10);
    const ohko = min >= H;
    const twohko = !ohko && min * 2 >= H;
    const threehko = !ohko && !twohko && min * 3 >= H;
    return { min, max, pmin, pmax, ohko, twohko, threehko, base };
  }, [level, power, atk, def, hp, stab, eff, burn, other, physical]);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Calculateur de dégâts</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Tous les calculateurs</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Niveau attaquant</label>
              <input type="number" min={1} max={100} value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Puissance</label>
              <input type="number" min={1} value={power} onChange={e => setPower(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Attaque</label>
              <input type="number" min={1} value={atk} onChange={e => setAtk(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Défense</label>
              <input type="number" min={1} value={def} onChange={e => setDef(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">PV adverses</label>
              <input type="number" min={1} value={hp} onChange={e => setHp(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Efficacité</label>
              <select value={eff} onChange={e => setEff(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                <option value={0}>0×</option>
                <option value={0.25}>0.25×</option>
                <option value={0.5}>0.5×</option>
                <option value={1}>1×</option>
                <option value={2}>2×</option>
                <option value={4}>4×</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={stab} onChange={e => setStab(e.target.checked)} className="h-4 w-4" />
              STAB
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={burn} onChange={e => setBurn(e.target.checked)} className="h-4 w-4" />
              Brûlure (physique)
            </label>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Catégorie</label>
              <select value={physical ? "phys" : "spec"} onChange={e => setPhysical(e.target.value === "phys")} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                <option value="phys">Physique</option>
                <option value="spec">Spéciale</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Autres multiplicateurs</label>
              <input type="number" step="0.01" min={0} value={other} onChange={e => setOther(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
          </div>

          <div className="mt-6 rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm">Dégâts min</div>
                <div className="text-xl font-semibold">{output.min}</div>
                <div className="text-xs text-gray-400">{output.pmin}% des PV</div>
              </div>
              <div>
                <div className="text-sm">Dégâts max</div>
                <div className="text-xl font-semibold">{output.max}</div>
                <div className="text-xs text-gray-400">{output.pmax}% des PV</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-300">
              {output.ohko ? (
                <span>OHKO garanti</span>
              ) : output.twohko ? (
                <span>2HKO garanti</span>
              ) : output.threehko ? (
                <span>3HKO garanti</span>
              ) : (
                <span>4HKO ou plus</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
