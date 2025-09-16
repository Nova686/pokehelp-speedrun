"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function NewSpeedrunRoutePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const steps = stepsText.split("\n").map(s => s.trim()).filter(Boolean);
    if (!title.trim() || !description.trim()) {
      setErr("Titre et description sont requis.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/speedrun/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), steps })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      const created = await res.json();
      router.push(`/speedrun/${created.id}`);
    } catch (e: any) {
      setErr(e?.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="py-10">
      {isPending ? (
        <p>Chargement…</p>
      ) : !session ? (
        <div className="mx-auto max-w-xl space-y-4">
          <h1 className="text-2xl font-bold text-white">Créer une route</h1>
          <p className="text-gray-300">Vous devez être connecté.</p>
          <Link href="/login" className="inline-block rounded bg-white/10 px-4 py-2">Se connecter</Link>
        </div>
      ) : (
        <section className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-[#121212] p-6">
          <h1 className="mb-6 text-xl font-semibold text-white">Nouvelle route</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm text-gray-300" htmlFor="title">Titre</label>
              <input id="title" className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" value={title} onChange={e => setTitle(e.target.value)} placeholder="Route Any% Kanto" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300" htmlFor="description">Description</label>
              <textarea id="description" className="min-h-28 w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" value={description} onChange={e => setDescription(e.target.value)} placeholder="Résumé de la route" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300" htmlFor="steps">Étapes</label>
              <textarea id="steps" className="min-h-44 w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" value={stepsText} onChange={e => setStepsText(e.target.value)} placeholder={"Chaque étape sur une ligne"} />
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <div className="flex items-center gap-3">
              <button disabled={busy} type="submit" className="rounded bg-white/10 px-4 py-2 text-white disabled:opacity-40">{busy ? "Création…" : "Créer la route"}</button>
              <Link href="/speedrun" className="text-gray-300 hover:text-white">Annuler</Link>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
