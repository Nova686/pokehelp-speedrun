"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

const TYPES = ["Combat","Vol","Poison","Sol","Roche","Insecte","Spectre","Acier","Feu","Eau","Plante","Électrik","Psy","Glace","Dragon","Ténèbres"];

function hiddenPowerType(iv: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number }) {
  const a = iv.hp % 2 ? 1 : 0;
  const b = iv.atk % 2 ? 1 : 0;
  const c = iv.def % 2 ? 1 : 0;
  const d = iv.spa % 2 ? 1 : 0;
  const e = iv.spd % 2 ? 1 : 0;
  const f = iv.spe % 2 ? 1 : 0;
  const x = a + 2 * b + 4 * c + 8 * d + 16 * e + 32 * f;
  const index = Math.floor((x * 15) / 63);
  return TYPES[index];
}

export default function HiddenPowerPage() {
  const [iv, setIv] = useState({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 });
  const type = useMemo(() => hiddenPowerType(iv), [iv]);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Puissance Cachée (Gen 3–6)</h1>
          <Link href="/calculators" className="text-sm text-gray-300 hover:text-white">← Tous les calculateurs</Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#121212] p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {(["hp","atk","def","spa","spd","spe"] as const).map(k => (
              <div key={k}>
                <label className="mb-1 block text-sm text-gray-300 uppercase">{k}</label>
                <input
                  type="number"
                  min={0}
                  max={31}
                  value={iv[k]}
                  onChange={e => setIv({ ...iv, [k]: Number(e.target.value) })}
                  className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 rounded border border-white/10 bg-[#0f0f0f] p-4 text-gray-200">
            <div className="text-sm">Type obtenu</div>
            <div className="text-xl font-semibold">{type}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
