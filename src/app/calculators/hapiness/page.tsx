"use client";
import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";

export default function HappinessCalculator() {
  const [current, setCurrent] = useState(70);
  const [action, setAction] = useState("walk");
  const [value, setValue] = useState<number | null>(null);

  const compute = async () => {
    const res = await fetch("/api/calculators/happiness", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ current, action })
    });
    const j = await res.json();
    setValue(j.value);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <CalculatorCard title="Calculateur de Bonheur (approximatif)">
        <div className="space-y-2">
          <label>Bonheur actuel <input type="number" className="border p-2 w-full" value={current} onChange={(e)=>setCurrent(+e.target.value)} /></label>
          <label>Action
            <select className="border p-2 w-full" value={action} onChange={(e)=>setAction(e.target.value)}>
              <option value="walk">Marcher</option>
              <option value="battle">Combattre (gain)</option>
              <option value="faint">K.O. (perte)</option>
              <option value="sootheBell">Grelot Zen</option>
            </select>
          </label>
          <button onClick={compute} className="bg-blue-600 text-white px-4 py-2 rounded">Appliquer</button>
          {value !== null && <p className="mt-3">Bonheur estimé : <b>{value}</b> / 255</p>}
        </div>
      </CalculatorCard>
    </main>
  );
}
