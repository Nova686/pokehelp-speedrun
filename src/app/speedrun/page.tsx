"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Rating = { id: string; value: number; userId: string; createdAt: string };
type Author = { id: string; name: string | null };
type SpeedrunRoute = {
  id: string;
  game?: string | null;
  title: string;
  description: string;
  steps: any[];
  ratings: Rating[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: Author | null;
};

export default function SpeedrunRoutesPage() {
  const [routes, setRoutes] = useState<SpeedrunRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedGame, setSelectedGame] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/speedrun/routes", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as SpeedrunRoute[];
        if (alive) setRoutes(json);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Erreur");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const games = useMemo(() => {
    const set = new Set<string>();
    routes.forEach(r => {
      const g = (r.game ?? "").trim();
      if (g) set.add(g);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }, [routes]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    routes.forEach(r => {
      const m = r.title.match(/Any%|No-?Glitch|Glitchless|100%/i);
      set.add(m ? m[0] : "Autre");
    });
    return Array.from(set);
  }, [routes]);

  const filtered = useMemo(() => {
    return routes.filter(r => {
      const game = (r.game ?? "Autre");
      const cat = (r.title.match(/Any%|No-?Glitch|Glitchless|100%/i)?.[0] ?? "Autre").toLowerCase();
      const okGame = selectedGame ? game === selectedGame : true;
      const okCat = selectedCategory ? cat === selectedCategory.toLowerCase() : true;
      return okGame && okCat;
    });
  }, [routes, selectedGame, selectedCategory]);

  useEffect(() => {
    if (!selectedRouteId && filtered.length > 0) {
      setSelectedRouteId(filtered[0].id);
    }
  }, [filtered, selectedRouteId]);

  function avg(rs: Rating[]): number {
    if (!rs?.length) return 0;
    const s = rs.reduce((a, b) => a + b.value, 0);
    return Math.round((s / rs.length) * 10) / 10;
  }

  return (
    <main className="py-8">
      <section className="mx-auto mb-8 max-w-5xl rounded-xl border border-white/10 bg-[#121212] p-6">
        <h1 className="mb-5 text-lg font-medium text-gray-200">Sélection</h1>
        <div className="mx-auto grid max-w-md gap-3">
          <div className="text-left">
            <label className="mb-1 block text-sm text-gray-300">Jeu</label>
            <select
              className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-sm text-gray-100"
              value={selectedGame}
              onChange={e => setSelectedGame(e.target.value)}
            >
              <option value="">Tous les jeux</option>
              {games.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="text-left">
            <label className="mb-1 block text-sm text-gray-300">Catégorie</label>
            <select
              className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-sm text-gray-100"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">Toutes</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl">
        {loading ? (
          <p className="text-gray-300">Chargement…</p>
        ) : err ? (
          <p className="text-red-400">Erreur: {err}</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {filtered.map(route => (
              <li key={route.id} className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-200">{route.game ?? "—"}</span>
                  <span className="text-sm text-gray-300">{avg(route.ratings) ? `${avg(route.ratings)}★` : "—"}</span>
                </div>
                <h2 className="text-base font-semibold text-white">
                  <Link href={`/speedrun/${route.id}`} className="hover:underline">{route.title}</Link>
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-gray-300">{route.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>{Array.isArray(route.steps) ? route.steps.length : 0} étapes</span>
                  <span>{new Date(route.createdAt).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
