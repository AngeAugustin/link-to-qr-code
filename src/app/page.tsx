import Link from "next/link";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { QrSvg } from "@/components/qr/QrSvg";
import { FREE_DYNAMIC_LIMIT } from "@/lib/qr-codes";
import { templateStyle } from "@/lib/qr-style";

const FEATURES = [
  { big: "30 %", title: "Correction d'erreur niveau H", body: "Le code reste lisible même quand un logo couvre jusqu'à 30 % des modules." },
  { big: "4:1", title: "Contraste minimum vérifié", body: "Le score de lisibilité vous alerte avant l'impression, pas après." },
  { big: "∞", title: "QR dynamiques", body: "Changez la destination après impression. Le motif ne bouge pas." },
  { big: "4 096 px", title: "Exports haute définition", body: "SVG vectoriel pour l'imprimeur, PNG jusqu'à 4K pour le web." },
];

const PLANS = [
  {
    name: "Gratuit",
    price: "0 €",
    period: "pour toujours",
    items: ["QR statiques illimités, sans compte", `${FREE_DYNAMIC_LIMIT} QR dynamiques avec statistiques`, "12 modèles et personnalisation complète", "Export SVG et PNG jusqu'à 4K"],
    cta: { label: "Créer un compte", href: "/inscription" },
    featured: false,
  },
  {
    name: "Pro",
    price: "9 €",
    period: "/ mois",
    items: ["QR dynamiques illimités", "Statistiques par jour, appareil et ville", "Logo importé sur chaque QR", "Support prioritaire"],
    cta: null,
    featured: true,
  },
];

function MiniQr({ id, text }: { id: string; text: string }) {
  const style = { ...templateStyle(id), margin: 1, ecl: "L" as const, logo: "none" as const };
  return (
    <div className="aspect-square h-full rounded-md p-0.5" style={{ background: style.bg }}>
      <QrSvg text={text} style={style} fit />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <HeroShowcase />
      </section>

      <section className="border-t border-outline-variant">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-[18em] text-headline-xl-mobile md:text-headline-xl">Du lien au QR imprimé en moins d&apos;une minute</h2>
            <Link href="/modeles" className="inline-flex h-11 items-center rounded-xl border border-outline-variant px-4 text-label-md hover:bg-surface-container-low">
              Voir les 12 modèles
            </Link>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className="flex flex-col gap-2.5 rounded-[22px] border border-outline-variant bg-surface-container-lowest p-6">
              <span className="font-mono text-label-sm text-primary-container">ÉTAPE 1</span>
              <h3 className="text-headline-md">Collez votre lien</h3>
              <p className="text-on-surface-variant">Site, menu, billetterie, portfolio ou formulaire : toute adresse web fonctionne.</p>
              <div className="mt-2 grid h-[120px] place-items-center rounded-2xl bg-surface-container-low">
                <div className="flex w-[84%] gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest p-1.5">
                  <span className="flex-1 truncate px-2 py-1.5 font-mono text-[12px] text-on-surface-variant">https://salle-lumen.fr/billets</span>
                  <span className="w-8 rounded-lg bg-primary-container" />
                </div>
              </div>
            </li>
            <li className="flex flex-col gap-2.5 rounded-[22px] border border-outline-variant bg-surface-container-lowest p-6">
              <span className="font-mono text-label-sm text-primary-container">ÉTAPE 2</span>
              <h3 className="text-headline-md">Partez d&apos;un modèle</h3>
              <p className="text-on-surface-variant">Douze bases, du plus sobre au plus expressif, toutes modifiables.</p>
              <div className="mt-2 flex h-[120px] items-center justify-center gap-2.5 rounded-2xl bg-surface-container-low py-3">
                {["perle", "corail", "kraft"].map((id) => (
                  <MiniQr key={id} id={id} text="https://trame.app" />
                ))}
              </div>
            </li>
            <li className="flex flex-col gap-2.5 rounded-[22px] border border-outline-variant bg-surface-container-lowest p-6">
              <span className="font-mono text-label-sm text-primary-container">ÉTAPE 3</span>
              <h3 className="text-headline-md">Ajustez et exportez</h3>
              <p className="text-on-surface-variant">Exportez en SVG pour l&apos;impression, en PNG pour le web.</p>
              <div className="mt-2 flex h-[120px] items-center justify-center gap-3 rounded-2xl bg-surface-container-low py-3">
                <MiniQr id="fluide" text="https://atelier-noma.fr" />
                <div className="grid gap-1.5">
                  {["SVG", "PNG 4K"].map((f) => (
                    <span key={f} className="rounded-md border border-outline-variant bg-surface-container-lowest px-2.5 py-1 font-mono text-[12px]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="border-t border-outline-variant">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="mb-8 text-headline-xl-mobile md:text-headline-xl">Beau, mais d&apos;abord fiable</h2>
          <div className="grid gap-px overflow-hidden rounded-[22px] border border-outline-variant bg-outline-variant sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-2 bg-surface-container-lowest p-6">
                <span className="font-display text-[34px] font-bold tracking-[-0.03em]">{f.big}</span>
                <h3 className="font-sans text-label-md">{f.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="offres" className="scroll-mt-20 border-t border-outline-variant">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="mb-8 text-headline-xl-mobile md:text-headline-xl">Des offres simples</h2>
          <div className="grid max-w-4xl gap-4 md:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.featured
                    ? "flex flex-col gap-4 rounded-[22px] bg-tertiary-container p-7 text-on-tertiary"
                    : "flex flex-col gap-4 rounded-[22px] border border-outline-variant bg-surface-container-lowest p-7"
                }
              >
                <span className="font-mono text-label-sm uppercase tracking-[0.09em] opacity-70">{plan.name}</span>
                <p className="font-display text-[40px] font-bold tracking-[-0.03em]">
                  {plan.price} <span className="font-sans text-[14px] font-medium tracking-normal opacity-70">{plan.period}</span>
                </p>
                <ul className="flex flex-col gap-2 text-body-sm">
                  {plan.items.map((item) => (
                    <li key={item} className={plan.featured ? "opacity-80" : "text-on-surface-variant"}>
                      <span className="mr-2 text-primary-container">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {plan.cta ? (
                  <Link href={plan.cta.href} className="mt-auto inline-flex h-11 items-center justify-center rounded-xl border border-outline-variant text-label-md hover:bg-surface-container-low">
                    {plan.cta.label}
                  </Link>
                ) : (
                  <span className="mt-auto inline-flex h-11 items-center justify-center rounded-xl bg-primary-container text-label-md text-on-primary">
                    Bientôt disponible
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
