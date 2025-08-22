"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function DamageCalculator() {
  const [level, setLevel] = useState(50);
  const [power, setPower] = useState(60);
  const [atk, setAtk] = useState(120);
  const [defn, setDef] = useState(100);
  const [stab, setStab] = useState(true);
  const [eff, setEff] = useState(1);
  const [crit, setCrit] = useState(false);
  const [range, setRange] = useState<{ min: number; max: number } | null>(null);

  const compute = async () => {
    const res = await fetch("/api/calculators/damages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, power, atk, defn, stab, eff, crit }),
    });
    setRange(await res.json());
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <CalculatorCard title="Calculateur de Dégâts (simplifié)">
        <div className="space-y-2">
          <label>Level <input type="number" className="border p-2 w-full" value={level} onChange={(e)=>setLevel(+e.target.value)} /></label>
          <label>Power <input type="number" className="border p-2 w-full" value={power} onChange={(e)=>setPower(+e.target.value)} /></label>
          <label>Attaque (eff.) <input type="number" className="border p-2 w-full" value={atk} onChange={(e)=>setAtk(+e.target.value)} /></label>
          <label>Défense (eff.) <input type="number" className="border p-2 w-full" value={defn} onChange={(e)=>setDef(+e.target.value)} /></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={stab} onChange={(e)=>setStab(e.target.checked)} /> STAB</label>
          <label>Efficacité <input type="number" step="0.25" className="border p-2 w-full" value={eff} onChange={(e)=>setEff(+e.target.value)} /></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={crit} onChange={(e)=>setCrit(e.target.checked)} /> Critique</label>

          <button onClick={compute} className="bg-blue-600 text-white px-4 py-2 rounded">Calculer</button>

          {range && <p className="mt-3">Range : <b>{range.min} - {range.max}</b></p>}
        </div>
      </CalculatorCard>
    </main>
  );
}
