"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function IVCalculator() {
  const [level, setLevel] = useState<number>(50);
  const [stat, setStat] = useState<number>(100);     // Stat observée (non-HP)
  const [base, setBase] = useState<number>(80);      // Base stat
  const [ev, setEv] = useState<number>(0);
  const [nature, setNature] = useState<number>(1);   // 0.9 | 1 | 1.1
  const [iv, setIv] = useState<number | null>(null);

  const compute = async () => {
    const res = await fetch("/api/calculators/iv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, stat, base, ev, nature }),
    });
    const data = await res.json();
    setIv(data.iv);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <CalculatorCard title="Calculateur IV" description="Estimez l'IV d'une statistique hors PV.">
        <div className="space-y-2">
          <label>Niveau <input type="number" className="border p-2 w-full" value={level} onChange={(e)=>setLevel(+e.target.value)} /></label>
          <label>Stat observée <input type="number" className="border p-2 w-full" value={stat} onChange={(e)=>setStat(+e.target.value)} /></label>
          <label>Base stat <input type="number" className="border p-2 w-full" value={base} onChange={(e)=>setBase(+e.target.value)} /></label>
          <label>EV <input type="number" className="border p-2 w-full" value={ev} onChange={(e)=>setEv(+e.target.value)} /></label>
          <label>Nature (0.9 / 1 / 1.1) <input type="number" step="0.1" className="border p-2 w-full" value={nature} onChange={(e)=>setNature(+e.target.value)} /></label>

          <button onClick={compute} className="bg-blue-600 text-white px-4 py-2 rounded">Calculer</button>

          {iv !== null && <p className="mt-4 font-semibold">IV estimé : {iv} / 31</p>}
        </div>
      </CalculatorCard>
    </main>
  );
}
