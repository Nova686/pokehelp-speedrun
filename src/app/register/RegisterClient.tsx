"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession, notifyAuthChanged } from "@/lib/auth-client";

export default function RegisterClient() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/speedrun";
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email.trim() || !name.trim() || !password.trim()) {
      setErr("Email, nom et mot de passe sont requis.");
      return;
    }
    if (password.length < 8) {
      setErr("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== password2) {
      setErr("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), password })
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
        S’inscrire avec {label}
      </button>
    );
  }

  return (
    <main className="py-10">
      <section className="mx-auto max-w-xl rounded-xl border border-white/10 bg-[#121212] p-6">
        <h1 className="mb-4 text-2xl font-bold text-white">Inscription</h1>
        {isPending ? (
          <p className="text-gray-300">Chargement…</p>
        ) : session ? (
          <div className="space-y-3">
            <p className="text-gray-300">Déjà connecté en tant que {session.user.email ?? session.user.name ?? session.user.id}.</p>
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
                <label htmlFor="name" className="mb-1 block text-sm text-gray-300">Nom</label>
                <input
                  id="name"
                  className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
                  placeholder="Votre nom"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-gray-300">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
                  placeholder="Au moins 8 caractères"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password2" className="mb-1 block text-sm text-gray-300">Confirmer le mot de passe</label>
                <input
                  id="password2"
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded border border-white/20 bg-[#0f0f0f] px-3 py-2 text-gray-100"
                  placeholder="Ressaisir le mot de passe"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                />
              </div>
              {err && <p className="text-sm text-red-400">{err}</p>}
              <div className="flex items-center gap-3">
                <button type="submit" disabled={busy} className="rounded bg-white/10 px-4 py-2 text-white disabled:opacity-40">
                  {busy ? "Création…" : "Créer le compte"}
                </button>
                <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-sm text-gray-300 hover:text-white">
                  Déjà inscrit ? Connexion
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
