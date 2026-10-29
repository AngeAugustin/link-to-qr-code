import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-body-sm text-on-surface-variant">
            Transformez n&apos;importe quel lien en QR code à votre image, lisible par tous les téléphones.
          </p>
        </div>
        <nav aria-label="Pied de page" className="grid grid-cols-2 gap-x-12 gap-y-2 text-body-sm">
          <Link href="/studio" className="text-on-surface-variant hover:text-on-surface">Studio</Link>
          <Link href="/modeles" className="text-on-surface-variant hover:text-on-surface">Modèles</Link>
          <Link href="/#offres" className="text-on-surface-variant hover:text-on-surface">Offres</Link>
          <Link href="/inscription" className="text-on-surface-variant hover:text-on-surface">Créer un compte</Link>
        </nav>
      </div>
    </footer>
  );
}
