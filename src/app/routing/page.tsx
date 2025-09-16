"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

type Rating = { id: string; value: number; userId: string; createdAt: string };
type Author = { id: string; name: string | null };
type SpeedrunRoute = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  ratings: Rating[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: Author | null;
};

export default function RoutingHome() {
  const { data: session } = useSession();
  const [routes, setRoutes] = useState<SpeedrunRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/speedrun/routes", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as SpeedrunRoute[];
        setRoutes(json);
      } catch (e: any) {
        setErr(e?.message ?? "Erreur");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return routes;
    return routes.filter(r => r.title.toLowerCase().includes(t) || r.description.toLowerCase().includes(t));
  }, [routes, q]);

  return (
    <main className="py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Routing</h1>
          <Link href="/routing/new" className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">Nouvelle route</Link>
        </div>
        <div className="mb-6">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher…" className="w-full max-w-sm rounded border border-white/20 bg-[#121212] px-3 py-2 text-sm text-gray-100" />
        </div>
        {loading ? (
          <p className="text-gray-300">Chargement…</p>
        ) : err ? (
          <p className="text-red-400">Erreur: {err}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-300">Aucune route.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {filtered.map(r => {
              const mine = session?.user?.id && r.createdBy === session.user.id;
              return (
                <li key={r.id} className="rounded-xl border border-white/10 bg-[#121212] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        <Link href={`/speedrun/${r.id}`} className="hover:underline">{r.title}</Link>
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-300">{r.description}</p>
                    </div>
                    <div className="text-xs text-gray-400">{r.steps.length} étapes</div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Link href={`/speedrun/${r.id}`} className="rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Voir</Link>
                    {mine ? (
                      <Link href={`/routing/${r.id}`} className="rounded bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Éditer</Link>
                    ) : (
                      <span className="rounded px-3 py-1.5 text-sm opacity-40">Non propriétaire</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
