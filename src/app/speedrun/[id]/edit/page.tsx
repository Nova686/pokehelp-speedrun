"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditSpeedrunRoute() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch(`/api/speedrun/routes/${id}`, { cache: "no-store" });
      const data = await res.json();
      setRouteData(data);
      setTitle(data.title);
      setDescription(data.description);
      setSteps(Array.isArray(data.steps) ? data.steps : []);
      setLoading(false);
    };
    load();
  }, [id]);

  const updateStep = (i: number, val: string) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[i] = val;
      return copy;
    });
  };

  const addStep = () => setSteps((prev) => [...prev, ""]);
  const removeStep = (i: number) => setSteps((prev) => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    const res = await fetch(`/api/speedrun/routes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, steps }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Erreur lors de la mise à jour");
      return;
    }
    router.push(`/speedrun/${id}`);
  };

  const cancel = () => router.push(`/speedrun/${id}`);

  if (loading) return <div className="p-6">Chargement…</div>;
  if (!routeData) return <div className="p-6">Route introuvable.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Modifier la route</h1>

      <label className="block">
        <span className="text-sm font-semibold">Titre</span>
        <input
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Description</span>
        <textarea
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </label>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Étapes</span>
          <button onClick={addStep} className="px-3 py-1 rounded bg-gray-200">
            + Ajouter une étape
          </button>
        </div>
        <ol className="space-y-2 list-decimal list-inside">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <textarea
                className="border p-2 w-full"
                value={s}
                onChange={(e) => updateStep(i, e.target.value)}
                rows={2}
              />
              <button
                onClick={() => removeStep(i)}
                className="px-3 py-1 rounded bg-red-500 text-white"
                title="Supprimer cette étape"
              >
                Suppr.
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-2">
        <button onClick={save} className="px-4 py-2 rounded bg-blue-600 text-white">
          Enregistrer
        </button>
        <button onClick={cancel} className="px-4 py-2 rounded bg-gray-200">
          Annuler
        </button>
      </div>
    </div>
  );
}
