import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/modeles", label: "Modèles" },
  { href: "/studio", label: "Studio" },
  { href: "/#offres", label: "Offres" },
];

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const initials = user?.name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-1 mr-auto">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-label-md font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/mes-qr"
              className="rounded-lg px-3 py-1.5 text-label-md font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            >
              Mes QR codes
            </Link>
          ) : null}
        </nav>
        <div className="ml-auto md:ml-0 flex items-center gap-2">
          {user ? (
            <>
              <Link href="/studio" className="hidden sm:inline-flex h-9 items-center rounded-[10px] bg-tertiary-container px-3.5 text-label-md text-on-tertiary hover:bg-tertiary">
                Créer un QR code
              </Link>
              <details className="relative">
                <summary
                  aria-label={`Compte de ${user.name}`}
                  className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full bg-primary-fixed text-label-sm font-bold text-primary-container [&::-webkit-details-marker]:hidden"
                >
                  {initials}
                </summary>
                <div className="absolute right-0 mt-2 w-60 rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg">
                  <p className="px-2 pt-1 text-label-md text-on-surface truncate">{user.name}</p>
                  <p className="px-2 pb-2 text-body-sm text-on-surface-variant truncate">{user.email}</p>
                  <Link href="/mes-qr" className="block rounded-lg px-2 py-2 text-body-md hover:bg-surface-container-low">
                    Mes QR codes
                  </Link>
                  <Link href="/modeles" className="block rounded-lg px-2 py-2 text-body-md hover:bg-surface-container-low md:hidden">
                    Modèles
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <button type="submit" className="w-full rounded-lg px-2 py-2 text-left text-body-md text-error hover:bg-surface-container-low">
                      Se déconnecter
                    </button>
                  </form>
                </div>
              </details>
            </>
          ) : (
            <>
              <Link href="/connexion" className="hidden sm:inline-flex h-9 items-center rounded-[10px] px-3 text-label-md text-on-surface-variant hover:text-on-surface">
                Connexion
              </Link>
              <Link href="/studio" className="inline-flex h-9 items-center rounded-[10px] bg-tertiary-container px-3.5 text-label-md text-on-tertiary hover:bg-tertiary">
                Créer un QR code
              </Link>
            </>
          )}
        </div>
      </div>
      <nav aria-label="Navigation mobile" className="md:hidden flex gap-1 overflow-x-auto no-scrollbar border-t border-outline-variant px-3 py-1.5">
        {[...LINKS, ...(user ? [{ href: "/mes-qr", label: "Mes QR codes" }] : [{ href: "/connexion", label: "Connexion" }])].map((l) => (
          <Link key={l.href} href={l.href} className="shrink-0 rounded-lg px-3 py-1 text-label-sm text-on-surface-variant hover:text-on-surface">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
