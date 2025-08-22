"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function EVCalculator() {
  const [evs, setEvs] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [result, setResult] = useState<{ total: number; perStatOk: boolean; totalOk: boolean } | null>(null);

  const update = (i: number, v: number) => {
    const n = [...evs];
    n[i] = v;
    setEvs(n);
  };

  const compute = async () => {
    const res = await fetch("/api/calculators/ev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evs }),
    });
    setResult(await res.json());
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <CalculatorCard title="Calculateur EV" description="Vérifie la validité des EV (max 510 total, 252 par stat).">
        <div className="grid grid-cols-2 gap-2">
          {["HP", "Atk", "Def", "SpA", "SpD", "Spe"].map((n, i) => (
            <label key={i}>
              {n} <input className="border p-2 w-full" type="number" value={evs[i]} onChange={(e)=>update(i, +e.target.value)} />
            </label>
          ))}
        </div>

        <button onClick={compute} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Vérifier</button>

        {result && (
          <div className="mt-3">
            <p>Total : <b>{result.total}</b> / 510</p>
            {!result.perStatOk && <p className="text-red-600">Max 252 par statistique.</p>}
            {!result.totalOk && <p className="text-red-600">Total EV dépassé.</p>}
          </div>
        )}
      </CalculatorCard>
    </main>
  );
}
