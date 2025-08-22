"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function EncountersCalculator() {
  const [rate, setRate] = useState(20);
  const [trials, setTrials] = useState(100);
  const [percent, setPercent] = useState<number | null>(null);

  const compute = async () => {
    const res = await fetch("/api/calculators/encounters", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ ratePercent: rate, trials })
    });
    const j = await res.json();
    setPercent(j.percent);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <CalculatorCard title="Calculateur de Rencontres (≥ 1)">
        <div className="space-y-2">
          <label>Taux de rencontre (%) <input type="number" className="border p-2 w-full" value={rate} onChange={(e)=>setRate(+e.target.value)} /></label>
          <label>Nombre d'essais / pas <input type="number" className="border p-2 w-full" value={trials} onChange={(e)=>setTrials(+e.target.value)} /></label>
          <button onClick={compute} className="bg-blue-600 text-white px-4 py-2 rounded">Calculer</button>
          {percent !== null && <p className="mt-3">P(au moins une rencontre) : <b>{percent}%</b></p>}
        </div>
      </CalculatorCard>
    </main>
  );
}
