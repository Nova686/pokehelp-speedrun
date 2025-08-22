"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SpeedrunListPage() {
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/speedrun/routes")
      .then((res) => res.json())
      .then(setRoutes);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Routes de Speedrun</h1>
      <Link href="/speedrun/new" className="text-blue-600 underline mb-4 block">Créer une route</Link>
      <ul className="space-y-4">
        {routes.map((r) => (
          <li key={r.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{r.title}</h2>
            <p>{r.description}</p>
            <p>⭐ {r.ratings.length > 0 ? (r.ratings.reduce((a: number, b: any) => a + b.value, 0) / r.ratings.length).toFixed(1) : "Pas encore noté"}</p>
            <Link href={`/speedrun/${r.id}`} className="text-blue-500 underline">Voir détails</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
