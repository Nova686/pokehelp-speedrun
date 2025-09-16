"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

type StepV2 = { title: string; notes?: string; subs: string[] };
type SpeedrunRoute = { id: string; title: string; description: string; steps: any; createdBy: string; createdAt: string; updatedAt: string };

type StepUI = { id: string; title: string; notes: string; subs: { id: string; text: string }[] };
function uid() { return Math.random().toString(36).slice(2); }

function toUI(steps: any): StepUI[] {
  if (!Array.isArray(steps)) return [];
  if (steps.every(s => typeof s === "string")) {
    return (steps as string[]).map(t => ({ id: uid(), title: String(t), notes: "", subs: [] }));
  }
  return (steps as StepV2[]).map(s => ({
    id: uid(),
    title: s?.title ?? "",
    notes: s?.notes ?? "",
    subs: Array.isArray(s?.subs) ? s.subs.map(ss => ({ id: uid(), text: String(ss) })) : []
  }));
}
function fromUI(steps: StepUI[]): StepV2[] {
  return steps.map(s => ({ title: s.title.trim(), notes: s.notes.trim() || undefined, subs: s.subs.map(ss => ss.text.trim()).filter(Boolean) })).filter(s => s.title);
}

export default function RoutingEdit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [route, setRoute] = useState<SpeedrunRoute | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<StepUI[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState<null | "ok" | "error">(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/speedrun/routes/${id}`, { cache: "no-store" });
      if (!res.ok) return;
      const j = (await res.json()) as SpeedrunRoute;
      setRoute(j);
      setTitle(j.title);
      setDescription(j.description);
      setSteps(toUI(j.steps));
    }
    if (id) load();
  }, [id]);

  function addStep(after?: number) {
    const s: StepUI = { id: uid(), title: "", notes: "", subs: [{ id: uid(), text: "" }] };
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

  function addSub(i: number, after?: number) {
    setSteps(prev => prev.map((s, idx) => {
      if (idx !== i) return s;
      const sub = { id: uid(), text: "" };
      if (after == null || after >= s.subs.length - 1) return { ...s, subs: [...s.subs, sub] };
      return { ...s, subs: [...s.subs.slice(0, (after ?? s.subs.length - 1) + 1), sub, ...s.subs.slice((after ?? s.subs.length - 1) + 1)] };
    }));
  }
  function moveSub(i: number, j: number, dir: -1 | 1) {
    setSteps(prev => prev.map((s, idx) => {
      if (idx !== i) return s;
      const k = j + dir;
      if (k < 0 || k >= s.subs.length) return s;
      const copy = s.subs.slice();
      [copy[j], copy[k]] = [copy[k], copy[j]];
      return { ...s, subs: copy };
    }));
  }
  function removeSub(i: number, j: number) {
    setSteps(prev => prev.map((s, idx) => {
      if (idx !== i) return s;
      if (s.subs.length <= 1) return s;
      return { ...s, subs: s.subs.filter((_, k) => k !== j) };
    }));
  }

  async function save() {
    if (!id) return;
    setErr(null); setSaved(null);
    const sanitized = fromUI(steps);
    if (!title.trim() || !description.trim() || sanitized.length === 0) {
      setErr("Titre, description et au moins une étape sont requis.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch(`/api/speedrun/routes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), steps: sanitized })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      setSaved("ok");
    } catch (e: any) {
      setErr(e?.message ?? "Erreur");
      setSaved("error");
    } finally {
      setBusy(false);
      setTimeout(() => setSaved(null), 1500);
    }
  }

  async function deleteRoute() {
    if (!id) return;
    if (!confirm("Supprimer cette route ?")) return;
    try {
      setBusy(true);
      const res = await fetch(`/api/speedrun/routes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(String(res.status));
      (window as any).location.assign("/routing");
    } catch (e: any) {
      setErr(e?.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

  if (isPending) return <main className="p-6">Chargement…</main>;
  if (!route) return <main className="p-6">Chargement des données…</main>;
  if (session && route.createdBy && session.user?.id !== route.createdBy) return <main className="p-6">Accès refusé.</main>;

  return (
    <main className="py-10">
      <section className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-[#121212] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Éditeur de route (étapes + sous-étapes)</h1>
          <Link href={`/speedrun/${route.id}`} className="text-sm text-gray-300 hover:text-white">Voir la page</Link>
        </div>

        <div className="grid gap-6">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Titre</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-28 w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100" />
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
                <input value={s.title} onChange={e => setSteps(prev => prev.map((it, i) => i === idx ? { ...it, title: e.target.value } : it))} className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />

                <label className="mt-3 mb-1 block text-xs text-gray-300">Notes</label>
                <textarea value={s.notes} onChange={e => setSteps(prev => prev.map((it, i) => i === idx ? { ...it, notes: e.target.value } : it))} className="min-h-20 w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-gray-100" />

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
            <button onClick={save} disabled={busy} className="rounded bg-white/10 px-4 py-2 text-white disabled:opacity-40">{busy ? "Sauvegarde…" : "Enregistrer"}</button>
            <button onClick={deleteRoute} disabled={busy} className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-40">Supprimer</button>
            {saved === "ok" && <span className="text-sm text-green-400">Sauvegardé</span>}
            {saved === "error" && <span className="text-sm text-red-400">Erreur</span>}
            <Link href="/routing" className="text-gray-300 hover:text-white">Retour</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
