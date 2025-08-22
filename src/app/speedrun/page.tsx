"use client";

import { useEffect, useState } from "react";

export default function SpeedrunPage() {
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/speedrun/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Routes de Speedrun</h1>
      <ul>
        {routes.map((route) => (
          <li key={route.id} className="border p-2 mb-2">
            <a href={`/speedrun/${route.id}`} className="text-blue-500 underline">
              {route.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
