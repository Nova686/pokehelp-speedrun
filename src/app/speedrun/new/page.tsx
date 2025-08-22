"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSpeedrunRoute() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);

  const addStep = () => setSteps([...steps, ""]);
  const updateStep = (i: number, val: string) => {
    const copy = [...steps];
    copy[i] = val;
    setSteps(copy);
  };

  const handleSubmit = async () => {
    await fetch("/api/speedrun/routes", {
      method: "POST",
      body: JSON.stringify({ title, description, steps }),
    });
    router.push("/speedrun");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Nouvelle route</h1>
      <input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 block w-full mb-2" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 block w-full mb-2" />
      <h2 className="font-semibold mb-2">Étapes</h2>
      {steps.map((s, i) => (
        <input key={i} value={s} onChange={(e) => updateStep(i, e.target.value)} className="border p-1 block w-full mb-1" />
      ))}
      <button onClick={addStep} className="bg-gray-300 px-3 py-1 rounded mb-4">+ Ajouter étape</button>
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Créer</button>
    </div>
  );
}
