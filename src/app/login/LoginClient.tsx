"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession, notifyAuthChanged } from "@/lib/auth-client";

export default function LoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/speedrun";
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email.trim() || !password.trim()) {
      setErr("Email et mot de passe sont requis.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      notifyAuthChanged();
      router.replace(next);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

  function OAuthButton({ label }: { label: string }) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-2 rounded border border-white/15 bg-[#0f0f0f] px-4 py-2 text-sm text-gray-200 opacity-50 cursor-not-allowed"
        aria-disabled="true"
      >
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-white/20 text-[10px] text-gray-300">
          {label[0]}
        </span>
        Continuer avec {label}
      </button>
    );
  }

  return (
    <main className="py-10">
      <section className="mx-auto max-w-xl rounded-xl border border-white/10 bg-[#121212] p-6">
        <h1 className="mb-4 text-2xl font-bold text-white">Connexion</h1>
        {isPending ? (
          <p className="text-gray-300">Chargement…</p>
        ) : session ? (
          <div className="space-y-3">
            <p className="text-gray-300">Vous êtes connecté en tant que {session.user.email ?? session.user.name ?? session.user.id}.</p>
            <Link href={next} className="inline-block rounded bg-white/10 px-4 py-2">Continuer</Link>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-gray-300">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
                  placeholder="vous@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-gray-300">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              {err && <p className="text-sm text-red-400">{err}</p>}
              <div className="flex items-center gap-3">
                <button type="submit" disabled={busy} className="rounded bg-white/10 px-4 py-2 text-white disabled:opacity-40">
                  {busy ? "Connexion…" : "Se connecter"}
                </button>
                <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-sm text-gray-300 hover:text-white">
                  Pas de compte ? Inscription
                </Link>
              </div>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <OAuthButton label="Google" />
              <OAuthButton label="Discord" />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
