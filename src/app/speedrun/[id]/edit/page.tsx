"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EditRoutePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");

  useEffect(() => {
    fetch(`/api/speedrun/routes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setSteps(data.steps.join("\n"));
      });
  }, [id]);

  if (status === "loading") return <p>Chargement...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleUpdate = async () => {
    await fetch(`/api/speedrun/routes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        steps: steps.split("\n"),
      }),
    });
    router.push(`/speedrun/${id}`);
  };

  const handleDelete = async () => {
    await fetch(`/api/speedrun/routes/${id}`, { method: "DELETE" });
    router.push("/speedrun");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Modifier la route</h1>
      <input
        className="border p-2 mb-2 block w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 mb-2 block w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        className="border p-2 mb-2 block w-full"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2"
          onClick={handleUpdate}
        >
          Mettre à jour
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2"
          onClick={handleDelete}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
