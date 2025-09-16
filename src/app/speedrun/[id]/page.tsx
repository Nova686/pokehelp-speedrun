"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

type Rating = { id: string; value: number; userId: string; createdAt: string };
type Author = { id: string; name: string | null };
type StepV2 = { title: string; notes?: string; subs: string[] };
type RouteData = {
  id: string;
  title: string;
  description: string;
  steps: any;
  ratings: Rating[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: Author | null;
};

function asV2(steps: any): StepV2[] {
  if (!Array.isArray(steps)) return [];
  if (steps.every(s => typeof s === "string")) {
    return (steps as string[]).map(t => ({ title: String(t), subs: [] }));
  }
  return (steps as StepV2[]).map(s => ({ title: s?.title ?? "", notes: s?.notes ?? "", subs: Array.isArray(s?.subs) ? s.subs.map(x => String(x)) : [] })).filter(s => s.title);
}

export default function SpeedrunShowPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/speedrun/routes/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as RouteData;
        setRoute(json);
      } catch (e: any) {
        setErr(e?.message ?? "Erreur");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const steps = useMemo(() => asV2(route?.steps ?? []), [route]);
  const stepCount = steps.length;
  const current = steps[index] || null;

  function toggleSub(i: number) {
    const key = `${index}:${i}`;
    setProgress(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function next() { setIndex(i => Math.min(stepCount - 1, i + 1)); }
  function prev() { setIndex(i => Math.max(0, i - 1)); }

  const average = useMemo(() => {
    if (!route?.ratings?.length) return 0;
    const s = route.ratings.reduce((a, b) => a + b.value, 0);
    return Math.round((s / route.ratings.length) * 10) / 10;
  }, [route]);

  return (
    <main className="py-10">
      {loading ? (
        <p className="text-gray-300">Chargement…</p>
      ) : err ? (
        <p className="text-red-400">Erreur: {err}</p>
      ) : !route ? (
        <p>Introuvable.</p>
      ) : (
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">{route.title}</h1>
              <div className="text-sm text-gray-300">{average ? `${average}★` : "Aucune note"}</div>
            </div>
            <div className="text-xs text-gray-400">{route.user?.name ?? "Anonyme"} • {new Date(route.createdAt).toLocaleDateString()}</div>
            <p className="mt-2 text-gray-300">{route.description}</p>
          </div>

          {/* Suivi étape par étape */}
          <section className="rounded-xl border border-white/10 bg-[#121212] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-300">Étape {Math.min(index + 1, stepCount)} / {stepCount}</div>
              <div className="flex gap-2">
                <button onClick={prev} disabled={index <= 0} className="rounded bg-white/10 px-3 py-1.5 text-sm text-white disabled:opacity-40">← Précédent</button>
                <button onClick={next} disabled={index >= stepCount - 1} className="rounded bg-white/10 px-3 py-1.5 text-sm text-white disabled:opacity-40">Suivant →</button>
              </div>
            </div>

            {!current ? (
              <div className="text-gray-400">Aucune étape.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-lg font-semibold text-white">{current.title}</div>
                  {current.notes && <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">{current.notes}</p>}
                </div>

                <div>
                  {current.subs.length === 0 ? (
                    <p className="text-sm text-gray-400">Cette étape n’a pas de sous-étapes.</p>
                  ) : (
                    <ul className="space-y-2">
                      {current.subs.map((text, i) => {
                        const key = `${index}:${i}`;
                        const done = !!progress[key];
                        return (
                          <li key={i} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={() => toggleSub(i)}
                              className="h-4 w-4"
                            />
                            <span className={`text-gray-200 ${done ? "line-through opacity-70" : ""}`}>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </section>

          <div className="flex items-center justify-between">
            <Link href="/speedrun" className="text-sm text-gray-300 hover:text-white">← Retour</Link>
            {session?.user?.id === route.createdBy && (
              <Link href={`/routing/${route.id}`} className="rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Éditer</Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
