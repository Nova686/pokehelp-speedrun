"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SpeedrunDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [route, setRoute] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [me, setMe] = useState<{ loggedIn: boolean; user: { id: string | number } | null } | null>(null);

  useEffect(() => {
    fetch(`/api/speedrun/routes/${id}`).then((r) => r.json()).then(setRoute);
    fetch(`/api/me`).then((r) => r.json()).then(setMe).catch(() => setMe({ loggedIn: false, user: null }));
  }, [id]);

  const isOwner = useMemo(() => {
    if (!me?.loggedIn || !me.user || !route) return false;
    return String(route.createdBy) === String(me.user.id);
  }, [me, route]);

  const submitRating = async () => {
    const res = await fetch("/api/speedrun/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeId: id, value: rating }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Impossible d’enregistrer la note (connexion requise ?)");
      return;
    }
    alert("Note enregistrée");
  };

  const editRoute = () => router.push(`/speedrun/${id}/edit`);

  const deleteRoute = async () => {
    if (!confirm("Supprimer définitivement cette route ?")) return;
    const res = await fetch(`/api/speedrun/routes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Suppression impossible");
      return;
    }
    router.push("/speedrun");
  };

  if (!route) return <p className="p-6">Chargement...</p>;

  const avg =
    route.ratings?.length
      ? (route.ratings.reduce((a: number, b: any) => a + b.value, 0) / route.ratings.length).toFixed(1)
      : "—";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{route.title}</h1>
          <p className="text-gray-600">Auteur : {route.user?.name || route.createdBy || "N/A"}</p>
          <p>Note moyenne : ⭐ {avg} / 5</p>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button onClick={editRoute} className="px-3 py-1 rounded bg-gray-200">Modifier</button>
            <button onClick={deleteRoute} className="px-3 py-1 rounded bg-red-600 text-white">Supprimer</button>
          </div>
        )}
      </div>

      <p>{route.description}</p>

      <h2 className="font-semibold mt-4 mb-2">Étapes :</h2>
      <ol className="list-decimal list-inside space-y-1">
        {route.steps.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ol>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Noter cette route</h3>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2">
          <option value={0}>Choisir…</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button onClick={submitRating} className="bg-green-500 text-white px-3 py-1 rounded ml-2">Envoyer</button>
      </div>
    </div>
  );
}
