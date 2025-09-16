import { useCallback, useEffect, useState } from "react";

type User = { id: string; name?: string | null; email?: string | null };
type Session = { user: User } | null;

const AUTH_EVENT = "pokehelp:auth-changed";
const AUTH_PING_KEY = "pokehelp_auth_ping";

export function notifyAuthChanged() {
  try {
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch {}
  try {
    localStorage.setItem(AUTH_PING_KEY, String(Date.now()));
  } catch {}
}

export function useSession() {
  const [data, setData] = useState<Session>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const j = await res.json();
      setData(j?.user ? ({ user: j.user } as Session) : null);
    } catch (e) {
      setError(e);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const onAuth = () => refetch();
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_PING_KEY) refetch();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refetch();
    };
    const onFocus = () => refetch();

    window.addEventListener(AUTH_EVENT, onAuth);
    window.addEventListener("storage", onStorage);
    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener(AUTH_EVENT, onAuth);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [refetch]);

  return { data, isPending, error, refetch };
}

export async function signOut(opts?: { onSuccess?: () => void }) {
  try {
    await fetch("/api/auth/signout", { method: "POST" });
  } catch {}
  finally {
    notifyAuthChanged();
    if (opts?.onSuccess) opts.onSuccess();
  }
}
