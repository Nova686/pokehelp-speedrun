"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function StatsCalculator() {
  const [level, setLevel] = useState(50);
  const [bases, setBases] = useState([80, 80, 80, 80, 80, 80]);
  const [ivs, setIvs] = useState([31, 31, 31, 31, 31, 31]);
  const [evs, setEvs] = useState([0, 0, 0, 0, 0, 0]);
  const [nature, setNature] = useState(1);
  const [out, setOut] = useState<any>(null);
  const setArr = (setter: any, i: number, v: number) =>
    setter((a: number[]) => { const n = [...a]; n[i] = v; return n; });

  const compute = async () => {
    const res = await fetch("/api/calculators/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, bases, ivs, evs, nature }),
    });
    setOut(await res.json());
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <CalculatorCard title="Calculateur de Statistiques">
        <div className="space-y-2">
          <label>Niveau <input type="number" className="border p-2 w-full" value={level} onChange={(e)=>setLevel(+e.target.value)} /></label>
          <label>Nature (0.9 / 1 / 1.1) <input type="number" step="0.1" className="border p-2 w-full" value={nature} onChange={(e)=>setNature(+e.target.value)} /></label>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {["HP", "Atk", "Def", "SpA", "SpD", "Spe"].map((n, i) => (
            <div key={i} className="space-y-1">
              <div className="font-semibold">{n}</div>
              <label>Base <input type="number" className="border p-2 w-full" value={bases[i]} onChange={(e)=>setArr(setBases, i, +e.target.value)} /></label>
              <label>IV <input type="number" className="border p-2 w-full" value={ivs[i]} onChange={(e)=>setArr(setIvs, i, +e.target.value)} /></label>
              <label>EV <input type="number" className="border p-2 w-full" value={evs[i]} onChange={(e)=>setArr(setEvs, i, +e.target.value)} /></label>
            </div>
          ))}
        </div>

        <button onClick={compute} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Calculer</button>

        {out && (
          <p className="mt-3">
            HP: <b>{out.hp}</b> • Atk: <b>{out.atk}</b> • Def: <b>{out.def}</b> • SpA: <b>{out.spa}</b> • SpD: <b>{out.spd}</b> • Spe: <b>{out.spe}</b>
          </p>
        )}
      </CalculatorCard>
    </main>
  );
}
