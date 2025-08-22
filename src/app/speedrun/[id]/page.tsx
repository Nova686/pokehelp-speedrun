"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SpeedrunDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState<any>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    fetch(`/api/speedrun/routes/${id}`)
      .then((res) => res.json())
      .then((data) => setRoute(data));
  }, [id]);

  const handleRate = async () => {
    await fetch(`/api/speedrun/routes/${id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    alert("Note enregistrée !");
  };

  if (!route) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{route.title}</h1>
      <p>{route.description}</p>
      <h2 className="mt-4 font-semibold">Étapes :</h2>
      <ul>
        {route.steps.map((step: string, i: number) => (
          <li key={i}>- {step}</li>
        ))}
      </ul>

      <div className="mt-6">
        <h3 className="font-semibold">Noter cette route :</h3>
        <select
          className="border p-2"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        >
          <option value={0}>Choisir...</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} étoile{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={handleRate}
          className="ml-2 bg-blue-500 text-white px-4 py-2"
        >
          Noter
        </button>
      </div>
    </div>
  );
}
