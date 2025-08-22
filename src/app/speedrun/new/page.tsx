"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRoutePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");

  if (status === "loading") return <p>Chargement...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async () => {
    const res = await fetch("/api/speedrun/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        steps: steps.split("\n"),
      }),
    });

    if (res.ok) router.push("/speedrun");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Créer une nouvelle route</h1>
      <input
        className="border p-2 mb-2 block w-full"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 mb-2 block w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        className="border p-2 mb-2 block w-full"
        placeholder="Étapes (une par ligne)"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
      />
      <button className="bg-green-500 text-white px-4 py-2" onClick={handleSubmit}>
        Créer
      </button>
    </div>
  );
}
