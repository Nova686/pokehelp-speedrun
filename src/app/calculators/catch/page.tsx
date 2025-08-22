"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function CaptureCalculator() {
  const [hpMax, setHpMax] = useState(100);
  const [hpCurrent, setHpCurrent] = useState(20);
  const [ballRate, setBallRate] = useState(1);
  const [statusMult, setStatusMult] = useState(1);
  const [baseRate, setBaseRate] = useState(200);
  const [percent, setPercent] = useState<number | null>(null);

  const compute = async () => {
    const res = await fetch("/api/calculators/catch", {
      method: "POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ hpMax, hpCurrent, ballRate, statusMult, baseRate })
    });
    const j = await res.json();
    setPercent(j.percent);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <CalculatorCard title="Calculateur de Capture (simplifié)">
        <div className="space-y-2">
          <label>PV max <input type="number" className="border p-2 w-full" value={hpMax} onChange={(e)=>setHpMax(+e.target.value)} /></label>
          <label>PV actuels <input type="number" className="border p-2 w-full" value={hpCurrent} onChange={(e)=>setHpCurrent(+e.target.value)} /></label>
          <label>Ball rate <input type="number" step="0.1" className="border p-2 w-full" value={ballRate} onChange={(e)=>setBallRate(+e.target.value)} /></label>
          <label>Multiplicateur de statut <input type="number" step="0.1" className="border p-2 w-full" value={statusMult} onChange={(e)=>setStatusMult(+e.target.value)} /></label>
          <label>Taux de capture de l'espèce <input type="number" className="border p-2 w-full" value={baseRate} onChange={(e)=>setBaseRate(+e.target.value)} /></label>

          <button onClick={compute} className="bg-blue-600 text-white px-4 py-2 rounded">Calculer</button>

          {percent !== null && <p className="mt-3">Probabilité estimée : <b>{percent}%</b></p>}
        </div>
      </CalculatorCard>
    </main>
  );
}
