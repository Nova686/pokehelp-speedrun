"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

type SpeedrunRoute = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export default function EditRoutePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [route, setRoute] = useState<SpeedrunRoute | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/speedrun/routes/${id}`, { cache: "no-store" });
      if (!res.ok) return;
      const j = (await res.json()) as SpeedrunRoute;
      setRoute(j);
      setTitle(j.title);
      setDescription(j.description);
      setStepsText(j.steps.join("\n"));
    }
    if (id) load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setErr(null);
    const steps = stepsText.split("\n").map(s => s.trim()).filter(Boolean);
    try {
      setBusy(true);
      const res = await fetch(`/api/speedrun/routes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), steps })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      router.push(`/speedrun/${id}`);
    } catch (e: any) {
      setErr(e?.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Supprimer cette route ?")) return;
    try {
      setBusy(true);
      const res = await fetch(`/api/speedrun/routes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      router.push("/speedrun");
    } catch (e: any) {
      setErr(e?.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

  if (isPending) return <main className="p-6">Chargement…</main>;
  if (!session) {
    return (
      <main className="py-10">
        <div className="mx-auto max-w-xl space-y-4">
          <h1 className="text-2xl font-bold text-white">Éditer la route</h1>
          <p className="text-gray-300">Vous devez être connecté.</p>
          <Link href="/login" className="inline-block rounded bg-white/10 px-4 py-2">Se connecter</Link>
        </div>
      </main>
    );
  }
  if (!route) return <main className="p-6">Chargement des données…</main>;
  if (route.createdBy !== session.user.id) return <main className="p-6">Accès refusé.</main>;

  return (
    <main className="py-10">
      <section className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-[#121212] p-6">
        <h1 className="mb-6 text-xl font-semibold text-white">Éditer la route</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm text-gray-300" htmlFor="title">Titre</label>
            <input id="title" className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300" htmlFor="description">Description</label>
            <textarea id="description" className="min-h-28 w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300" htmlFor="steps">Étapes</label>
            <textarea id="steps" className="min-h-44 w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" value={stepsText} onChange={e => setStepsText(e.target.value)} />
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex items-center gap-3">
            <button disabled={busy} type="submit" className="rounded bg-white/10 px-4 py-2 text-white disabled:opacity-40">{busy ? "Sauvegarde…" : "Enregistrer"}</button>
            <button type="button" disabled={busy} onClick={handleDelete} className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-40">Supprimer</button>
            <Link href={`/speedrun/${route.id}`} className="text-gray-300 hover:text-white">Annuler</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
