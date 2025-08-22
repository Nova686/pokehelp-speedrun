"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function RangesCalculator() {
  const [level, setLevel] = useState(50);
  const [power, setPower] = useState(80);
  const [atk, setAtk] = useState(120);
  const [defn, setDef] = useState(100);
  const [stab, setStab] = useState(true);
  const [eff, setEff] = useState(1);
  const [crit, setCrit] = useState(false);
  const [out, setOut] = useState<{min:number; max:number; steps:number[]}|null>(null);

  const compute = async () => {
    const res = await fetch("/api/calculators/ranges", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ level, power, atk, defn, stab, eff, crit })
    });
    setOut(await res.json());
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <CalculatorCard title="Ranges d'attaques (16 valeurs)">
        <div className="space-y-2">
          <label>Level <input type="number" className="border p-2 w-full" value={level} onChange={(e)=>setLevel(+e.target.value)} /></label>
          <label>Power <input type="number" className="border p-2 w-full" value={power} onChange={(e)=>setPower(+e.target.value)} /></label>
          <label>Atk <input type="number" className="border p-2 w-full" value={atk} onChange={(e)=>setAtk(+e.target.value)} /></label>
          <label>Def <input type="number" className="border p-2 w-full" value={defn} onChange={(e)=>setDef(+e.target.value)} /></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={stab} onChange={(e)=>setStab(e.target.checked)} /> STAB</label>
          <label>Efficacité <input type="number" step="0.25" className="border p-2 w-full" value={eff} onChange={(e)=>setEff(+e.target.value)} /></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={crit} onChange={(e)=>setCrit(e.target.checked)} /> Critique</label>

          <button onClick={compute} className="bg-blue-600 text-white px-4 py-2 rounded">Calculer</button>

          {out && (
            <div className="mt-3">
              <p>Range : <b>{out.min} - {out.max}</b></p>
              <div className="mt-2 grid grid-cols-4 gap-1 text-sm">
                {out.steps.map((v, i) => (
                  <div key={i} className="px-2 py-1 bg-gray-100 rounded">{v}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CalculatorCard>
    </main>
  );
}
