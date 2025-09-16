"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

type Step = { id: string; title: string; notes: string; subs: { id: string; text: string }[] };

function uid() { return Math.random().toString(36).slice(2); }

export default function RoutingNew() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ id: uid(), title: "", notes: "", subs: [{ id: uid(), text: "" }] }]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function addStep(after?: number) {
    const s: Step = { id: uid(), title: "", notes: "", subs: [{ id: uid(), text: "" }] };
    if (after == null || after >= steps.length - 1) setSteps(prev => [...prev, s]);
    else setSteps(prev => [...prev.slice(0, after + 1), s, ...prev.slice(after + 1)]);
  }
  function moveStep(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= steps.length) return;
    const copy = steps.slice();
    [copy[index], copy[j]] = [copy[j], copy[index]];
    setSteps(copy);
  }
  function removeStep(index: number) {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter((_, i) => i !== index));
  }

  function addSub(stepIndex: number, after?: number) {
    setSteps(prev => prev.map((s, i) => {
      if (i !== stepIndex) return s;
      const sub = { id: uid(), text: "" };
      if (after == null || after >= s.subs.length - 1) return { ...s, subs: [...s.subs, sub] };
      return { ...s, subs: [...s.subs.slice(0, (after ?? s.subs.length - 1) + 1), sub, ...s.subs.slice((after ?? s.subs.length - 1) + 1)] };
    }));
  }
  function moveSub(stepIndex: number, subIndex: number, dir: -1 | 1) {
    setSteps(prev => prev.map((s, i) => {
      if (i !== stepIndex) return s;
      const j = subIndex + dir;
      if (j < 0 || j >= s.subs.length) return s;
      const copy = s.subs.slice();
      [copy[subIndex], copy[j]] = [copy[j], copy[subIndex]];
      return { ...s, subs: copy };
    }));
  }
  function removeSub(stepIndex: number, subIndex: number) {
    setSteps(prev => prev.map((s, i) => {
      if (i !== stepIndex) return s;
      if (s.subs.length <= 1) return s;
      return { ...s, subs: s.subs.filter((_, k) => k !== subIndex) };
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const cleanSteps = steps.map(s => ({
      title: s.title.trim(),
      notes: s.notes.trim() || undefined,
      subs: s.subs.map(x => x.text.trim()).filter(Boolean)
    })).filter(s => s.title);
    if (!title.trim() || !description.trim() || cleanSteps.length === 0) {
      setErr("Titre, description et au moins une étape sont requis.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/speedrun/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), steps: cleanSteps })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      const created = await res.json();
      router.push(`/routing/${created.id}`);
    } catch (e: any) {
      setErr(e?.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

  if (isPending) return <main className="p-6">Chargement…</main>;
  if (!session) return (
    <main className="py-10">
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-bold text-white">Créer une route</h1>
        <p className="text-gray-300">Vous devez être connecté.</p>
        <Link href="/login" className="inline-block rounded bg-white/10 px-4 py-2">Se connecter</Link>
      </div>
    </main>
  );

  return (
    <main className="py-10">
      <section className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-[#121212] p-6">
        <h1 className="mb-6 text-xl font-semibold text-white">Nouvelle route (étapes + sous-étapes)</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Titre</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" placeholder="Any% Kanto" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-24 w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" placeholder="Résumé court" />
          </div>

          <div className="space-y-4">
            {steps.map((s, idx) => (
              <div key={s.id} className="rounded border border-white/10 bg-[#0f0f0f] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white">Étape {idx + 1}</div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveStep(idx, -1)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">↑</button>
                    <button type="button" onClick={() => moveStep(idx, 1)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">↓</button>
                    <button type="button" onClick={() => addStep(idx)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">＋</button>
                    <button type="button" onClick={() => removeStep(idx)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">✕</button>
                  </div>
                </div>

                <label className="mt-3 mb-1 block text-xs text-gray-300">Titre</label>
                <input value={s.title} onChange={e => setSteps(prev => prev.map((it, i) => i === idx ? { ...it, title: e.target.value } : it))} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" placeholder="Bourg Palette → Route 1" />

                <label className="mt-3 mb-1 block text-xs text-gray-300">Notes (optionnel)</label>
                <textarea value={s.notes} onChange={e => setSteps(prev => prev.map((it, i) => i === idx ? { ...it, notes: e.target.value } : it))} className="min-h-20 w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" placeholder="Détails, menues, RNG, etc." />

                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-200">Sous-étapes</div>
                  <ul className="mt-2 space-y-2">
                    {s.subs.map((sub, subIdx) => (
                      <li key={sub.id} className="flex items-center gap-2">
                        <div className="w-6 text-right text-[11px] text-gray-400">{subIdx + 1}.</div>
                        <input
                          value={sub.text}
                          onChange={e => setSteps(prev => prev.map((it, i) =>
                            i === idx ? { ...it, subs: it.subs.map((ss, j) => j === subIdx ? { ...ss, text: e.target.value } : ss) } : it
                          ))}
                          className="flex-1 rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100"
                          placeholder="Action précise"
                        />
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveSub(idx, subIdx, -1)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">↑</button>
                          <button type="button" onClick={() => moveSub(idx, subIdx, 1)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">↓</button>
                          <button type="button" onClick={() => addSub(idx, subIdx)} className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">＋</button>
                          <button type="button" onClick={() => removeSub(idx, subIdx)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">✕</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => addSub(idx)} className="mt-2 rounded bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20">Ajouter une sous-étape</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addStep()} className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Ajouter une étape</button>
          </div>

          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex items-center gap-3">
            <button disabled={busy} type="submit" className="rounded bg-white/10 px-4 py-2 text-white disabled:opacity-40">{busy ? "Création…" : "Créer et éditer"}</button>
            <Link href="/routing" className="text-gray-300 hover:text-white">Annuler</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
