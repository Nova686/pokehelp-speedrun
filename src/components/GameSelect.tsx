"use client";
import { useEffect, useState } from "react";
import { POKEMON_GAMES } from "@/lib/pokemon-games";

type Props = {
  value: string | null | undefined;
  onChange: (v: string) => void;
  label?: string;
  required?: boolean;
  name?: string;
};

export default function GameSelect({ value, onChange, label = "Jeu", required, name = "game" }: Props) {
  const [games, setGames] = useState<string[]>([...POKEMON_GAMES]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/speedrun/games", { cache: "no-store" });
        if (r.ok) {
          const j = (await r.json()) as string[];
          if (alive && Array.isArray(j) && j.length) setGames(j);
        }
      } catch {}
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <label className="mb-1 block text-sm text-gray-300" htmlFor="game-select">{label}</label>
      <select
        id="game-select"
        name={name}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
      >
        <option value="" disabled>{loading ? "Chargement…" : "Choisir un jeu"}</option>
        {games.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
    </div>
  );
}
