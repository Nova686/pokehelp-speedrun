"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import StarRating from "@/components/StarRating";

type StepV2 = { title: string; notes?: string; subs: string[] };
type Rating = { id: string; value: number; userId: string; routeId: string };
type Route = {
  id: string;
  game?: string | null;
  title: string;
  description?: string | null;
  steps: StepV2[];
  ratings: Rating[];
  user?: { id: string; name?: string | null } | null;
};

export default function SpeedrunRoutePage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [route, setRoute] = useState<Route | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/speedrun/routes/${id}`, { cache: "no-store" });
        if (!r.ok) throw new Error(`${r.status}`);
        const j = await r.json();
        if (alive) setRoute(j);
      } catch (e: any) {
        if (alive) setErr(String(e?.message || e));
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const avg = useMemo(() => {
    if (!route?.ratings?.length) return 0;
    const s = route.ratings.reduce((a, r) => a + (r.value || 0), 0);
    return Math.round((s / route.ratings.length) * 10) / 10;
  }, [route]);

  const myRating = useMemo(() => {
    if (!route || !session?.user?.id) return null;
    const r = route.ratings.find(x => x.userId === session.user.id);
    return r?.value ?? null;
  }, [route, session]);

  async function handleRate(v: number) {
    if (!session?.user?.id || !route) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/speedrun/routes/${route.id}/rating`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ value: v }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();

      setRoute(prev => {
        if (!prev) return prev;
        const existing = prev.ratings.find(r => r.userId === session.user!.id);
        let ratings: Rating[];
        if (existing) {
          ratings = prev.ratings.map(r => r.userId === session.user!.id ? { ...r, value: v } : r);
        } else {
          ratings = [...prev.ratings, { id: `local-${Date.now()}`, userId: session.user!.id, routeId: prev.id, value: v }];
        }
        return { ...prev, ratings };
      });
    } catch (e: any) {
      setErr(`Impossible d’enregistrer la note: ${e?.message ?? e}`);
    } finally {
      setSaving(false);
    }
  }

  if (err) return <main className="py-10"><p className="text-red-400">Erreur: {err}</p></main>;
  if (!route) return <main className="py-10"><p className="text-gray-300">Chargement…</p></main>;

  const total = route.steps?.length || 0;
  const step = route.steps?.[idx];

  return (
    <main className="py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href="/speedrun" className="text-sm text-gray-400 hover:text-white">← Retour</Link>
            <h1 className="mt-2 text-2xl font-bold text-white">{route.title}</h1>
            {route.game && <div className="text-sm text-gray-400 mt-1">{route.game}</div>}
          </div>

          <div className="rounded-xl border border-white/10 bg-[#121212] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Note moyenne</span>
                <div className="flex items-center gap-2">
                  <StarRating value={avg} readOnly size={18} />
                  <span className="text-sm text-gray-300">{avg || 0}/5</span>
                  <span className="text-xs text-gray-500">({route.ratings?.length || 0})</span>
                </div>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400">Ma note</span>
                {session ? (
                  <div className="flex items-center gap-2">
                    <StarRating
                      value={myRating ?? 0}
                      onChange={saving ? undefined : handleRate}
                      readOnly={saving}
                      size={20}
                    />
                    {saving && <span className="text-xs text-gray-500">Enregistrement…</span>}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Connectez-vous pour noter</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {route.description && (
          <p className="text-gray-300">{route.description}</p>
        )}

        <section className="rounded-xl border border-white/10 bg-[#121212] p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-gray-400">Étape {Math.min(idx + 1, total)} / {total}</div>
            <div className="flex items-center gap-2">
              <button
                className="rounded bg-white/10 px-3 py-1 text-sm text-white disabled:opacity-40"
                onClick={() => setIdx(i => Math.max(0, i - 1))}
                disabled={idx <= 0}
              >
                Précédent
              </button>
              <button
                className="rounded bg-white/10 px-3 py-1 text-sm text-white disabled:opacity-40"
                onClick={() => setIdx(i => Math.min(total - 1, i + 1))}
                disabled={idx >= total - 1}
              >
                Suivant
              </button>
            </div>
          </div>

          {step ? (
            <div>
              <h2 className="text-lg font-semibold text-white">{step.title}</h2>
              {step.notes && <p className="mt-1 text-sm text-gray-300">{step.notes}</p>}
              {Array.isArray(step.subs) && step.subs.length > 0 && (
                <ul className="mt-3 list-disc pl-5 text-gray-200">
                  {step.subs.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Aucune étape.</p>
          )}
        </section>
      </div>
    </main>
  );
}
