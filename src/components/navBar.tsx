"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

function NavItem({ href, label, disabled }: { href?: string; label: string; disabled?: boolean }) {
  const pathname = usePathname();
  const active = href && pathname.startsWith(href);
  if (disabled) return <span className="px-3 py-2 text-sm opacity-40 cursor-not-allowed select-none">{label}</span>;
  if (!href) return <span className="px-3 py-2 text-sm">{label}</span>;
  return (
    <Link href={href} className={`px-3 py-2 text-sm hover:text-white ${active ? "text-white border-b border-white/70" : "text-gray-300"}`}>
      {label}
    </Link>
  );
}

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#151515]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight text-white">PokéHelp</Link>
        <nav className="flex items-center gap-1">
          <NavItem href="/calculators" label="Calculateurs" />
          <NavItem href="/speedrun" label="Speedrun" />
          <NavItem href="/routing" label="Routing" />
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">FR</span>
          {session ? (
            <Link href="/user" className="text-sm text-gray-300 hover:text-white">Mon compte</Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-300 hover:text-white">Connexion</Link>
              <Link href="/register" className="text-sm text-gray-300 hover:text-white">Inscription</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
