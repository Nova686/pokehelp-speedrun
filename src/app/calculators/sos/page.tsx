"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function SOSCalculator() {
  const [calls, setCalls] = useState(0);
  const [percent, setPercent] = useState<number | null>(null);

  const compute = async () => {
    const res = await fetch("/api/calculators/sos", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ calls })
    });
    const j = await res.json();
    setPercent(j.percent);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <CalculatorCard title="Calculateur SOS (approx)">
        <div className="space-y-2">
          <label>Nombre d'appels <input type="number" className="border p-2 w-full" value={calls} onChange={(e)=>setCalls(+e.target.value)} /></label>
          <button onClick={compute} className="bg-blue-600 text-white px-4 py-2 rounded">Calculer</button>
          {percent !== null && <p className="mt-3">Probabilité shiny estimée : <b>{percent}%</b></p>}
        </div>
      </CalculatorCard>
    </main>
  );
}
