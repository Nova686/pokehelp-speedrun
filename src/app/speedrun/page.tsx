"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

export default function SpeedrunPage() {
  const [routes, setRoutes] = useState<SpeedrunRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [selectedGame, setSelectedGame] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

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

  const games = useMemo(() => {
    const set = new Set<string>();
    routes.forEach(r => {
      const first = r.title.split(" ")[0] || "Autre";
      set.add(first);
    });
    return Array.from(set);
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
      const game = r.title.split(" ")[0] || "Autre";
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
    <main className="py-10">
      <div className="mx-auto max-w-2xl text-center">
        <button
          disabled
          title="Connexion à LiveSplit non disponible"
          className="mx-auto mb-6 rounded border border-white/20 px-4 py-2 text-sm text-gray-200 opacity-60"
        >
          Connexion à livesplit
        </button>
        <div className="mx-auto mb-6 h-px w-80 bg-white/10" />
        <h1 className="mb-5 text-lg font-medium text-gray-200">Configuration manuelle</h1>

        <div className="mx-auto grid max-w-md gap-3">
          <div className="text-left">
            <label className="mb-1 block text-sm text-gray-300">Jeu</label>
            <select
              className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-sm text-gray-100"
              value={selectedGame}
              onChange={e => setSelectedGame(e.target.value)}
            >
              <option value="">Choisir un jeu</option>
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
              <option value="">Choisir une catégorie</option>
              {categories.map(c => (
                <option key={c} value={c.toLowerCase()}>{c}</option>
              ))}
            </select>
          </div>

          <div className="text-left">
            <label className="mb-1 block text-sm text-gray-300">Route</label>
            <select
              className="w-full rounded border border-white/20 bg-[#121212] px-3 py-2 text-sm text-gray-100"
              value={selectedRouteId}
              onChange={e => setSelectedRouteId(e.target.value)}
            >
              <option value="">Choisir une route</option>
              {filtered.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>

          <Link
            href={selectedRouteId ? `/speedrun/${selectedRouteId}` : "#"}
            aria-disabled={!selectedRouteId}
            className={`mx-auto mt-2 inline-block rounded bg-white/10 px-4 py-2 text-sm ${selectedRouteId ? "hover:bg-white/20" : "opacity-40 cursor-not-allowed"}`}
          >
            Commencer
          </Link>
        </div>
      </div>

      <section className="mx-auto mt-12 max-w-6xl">
        {loading ? (
          <p className="text-gray-300">Chargement…</p>
        ) : err ? (
          <p className="text-red-400">Erreur: {err}</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {routes.map(route => (
              <li key={route.id} className="rounded-xl border border-white/10 bg-[#121212] p-5 hover:border-white/20">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-semibold text-white">
                    <Link href={`/speedrun/${route.id}`} className="hover:underline">{route.title}</Link>
                  </h2>
                  <div className="shrink-0 text-sm text-gray-300">{avg(route.ratings) ? `${avg(route.ratings)}★` : "—"}</div>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-gray-300">{route.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>{route.steps.length} étapes</span>
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
