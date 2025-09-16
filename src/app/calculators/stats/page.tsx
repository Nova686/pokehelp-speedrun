"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Nature = keyof typeof NATURES;

const NATURES: Record<string, { atk: number; def: number; spa: number; spd: number; spe: number }> = {
  Hardy: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
  Lonely: { atk: 1.1, def: 0.9, spa: 1, spd: 1, spe: 1 },
  Brave: { atk: 1.1, def: 1, spa: 1, spd: 1, spe: 0.9 },
  Adamant: { atk: 1.1, def: 1, spa: 0.9, spd: 1, spe: 1 },
  Naughty: { atk: 1.1, def: 1, spa: 1, spd: 0.9, spe: 1 },
  Bold: { atk: 0.9, def: 1.1, spa: 1, spd: 1, spe: 1 },
  Docile: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
  Relaxed: { atk: 1, def: 1.1, spa: 1, spd: 1, spe: 0.9 },
  Impish: { atk: 0.9, def: 1.1, spa: 1, spd: 1, spe: 1 },
  Lax: { atk: 1, def: 1.1, spa: 1, spd: 0.9, spe: 1 },
  Timid: { atk: 0.9, def: 1, spa: 1, spd: 1, spe: 1.1 },
  Hasty: { atk: 1, def: 0.9, spa: 1, spd: 1, spe: 1.1 },
  Serious: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
  Jolly: { atk: 1, def: 1, spa: 0.9, spd: 1, spe: 1.1 },
  Naive: { atk: 1, def: 1, spa: 1, spd: 0.9, spe: 1.1 },
  Modest: { atk: 0.9, def: 1, spa: 1.1, spd: 1, spe: 1 },
  Mild: { atk: 1, def: 0.9, spa: 1.1, spd: 1, spe: 1 },
  Quiet: { atk: 1, def: 1, spa: 1.1, spd: 1, spe: 0.9 },
  Bashful: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
  Rash: { atk: 1, def: 1, spa: 1.1, spd: 0.9, spe: 1 },
  Calm: { atk: 0.9, def: 1, spa: 1, spd: 1.1, spe: 1 },
  Gentle: { atk: 1, def: 0.9, spa: 1, spd: 1.1, spe: 1 },
  Sassy: { atk: 1, def: 1, spa: 1, spd: 1.1, spe: 0.9 },
  Careful: { atk: 1, def: 1, spa: 0.9, spd: 1.1, spe: 1 },
  Quirky: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 }
};

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

export default function StatsPage() {
  const [level, setLevel] = useState(50);
  const [nature, setNature] = useState<Nature>("Serious");
  const [base, setBase] = useState({ hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 });
  const [iv, setIv] = useState({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 });
  const [ev, setEv] = useState({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });

  const mods = NATURES[nature];

  const out = useMemo(() => {
    const L = clamp(level, 1, 100);
    return {
      hp: statHP(base.hp, iv.hp, ev.hp, L),
      atk: statOther(base.atk, iv.atk, ev.atk, L, mods.atk),
      def: statOther(base.def, iv.def, ev.def, L, mods.def),
      spa: statOther(base.spa, iv.spa, ev.spa, L, mods.spa),
      spd: statOther(base.spd, iv.spd, ev.spd, L, mods.spd),
      spe: statOther(base.spe, iv.spe, ev.spe, L, mods.spe)
    };
  }, [level, nature, base, iv, ev, mods]);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Stats finales</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Tous les calculateurs</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Niveau</label>
              <input type="number" min={1} max={100} value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-gray-300">Nature</label>
              <select value={nature} onChange={e => setNature(e.target.value as Nature)} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100">
                {Object.keys(NATURES).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {(["hp","atk","def","spa","spd","spe"] as const).map(key => (
              <div key={key} className="rounded border border-white/10 bg-[#0f0f0f] p-4">
                <div className="text-sm font-medium text-gray-200 uppercase">{key}</div>
                <label className="mt-2 block text-xs text-gray-300">Base</label>
                <input type="number" min={1} value={base[key]} onChange={e => setBase({ ...base, [key]: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                <label className="mt-2 block text-xs text-gray-300">IV</label>
                <input type="number" min={0} max={31} value={iv[key]} onChange={e => setIv({ ...iv, [key]: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                <label className="mt-2 block text-xs text-gray-300">EV</label>
                <input type="number" min={0} max={252} step={4} value={ev[key]} onChange={e => setEv({ ...ev, [key]: Number(e.target.value) })} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />
                <div className="mt-3 text-lg font-semibold text-white">{out[key]}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
