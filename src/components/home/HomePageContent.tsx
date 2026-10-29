"use client";

import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useT } from "@/components/i18n/LocaleProvider";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { QrSvg } from "@/components/qr/QrSvg";
import { FREE_DYNAMIC_LIMIT } from "@/lib/qr-codes";
import { templateStyle } from "@/lib/qr-style";

function MiniQr({ id, text }: { id: string; text: string }) {
  const style = { ...templateStyle(id), margin: 1, ecl: "L" as const, logo: "none" as const };
  return (
    <div className="aspect-square h-full rounded-md p-0.5" style={{ background: style.bg }}>
      <QrSvg text={text} style={style} fit />
    </div>
  );
}

export function HomePageContent() {
  const t = useT();

  const features = [
    { big: t("marketing.features.f1Big"), title: t("marketing.features.f1Title"), body: t("marketing.features.f1Body") },
    { big: t("marketing.features.f2Big"), title: t("marketing.features.f2Title"), body: t("marketing.features.f2Body") },
    { big: t("marketing.features.f3Big"), title: t("marketing.features.f3Title"), body: t("marketing.features.f3Body") },
    { big: t("marketing.features.f4Big"), title: t("marketing.features.f4Title"), body: t("marketing.features.f4Body") },
  ];

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <HeroShowcase />
      </section>

      <section className="border-t border-outline-variant">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-[18em] text-headline-xl-mobile md:text-headline-xl">{t("marketing.steps.title")}</h2>
            <LocaleLink
              href="/modeles"
              className="inline-flex h-11 items-center rounded-xl border border-outline-variant px-4 text-label-md hover:bg-surface-container-low"
            >
              {t("marketing.steps.templatesLink")}
            </LocaleLink>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className="flex flex-col gap-2.5 rounded-[22px] border border-outline-variant bg-surface-container-lowest p-6">
              <span className="font-mono text-label-sm text-primary-container">{t("marketing.steps.step1Label")}</span>
              <h3 className="text-headline-md">{t("marketing.steps.step1Title")}</h3>
              <p className="text-on-surface-variant">{t("marketing.steps.step1Body")}</p>
              <div className="mt-2 grid h-[120px] place-items-center rounded-2xl bg-surface-container-low">
                <div className="flex w-[84%] gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest p-1.5">
                  <span className="flex-1 truncate px-2 py-1.5 font-mono text-[12px] text-on-surface-variant">
                    https://salle-lumen.fr/billets
                  </span>
                  <span className="w-8 rounded-lg bg-primary-container" />
                </div>
              </div>
            </li>
            <li className="flex flex-col gap-2.5 rounded-[22px] border border-outline-variant bg-surface-container-lowest p-6">
              <span className="font-mono text-label-sm text-primary-container">{t("marketing.steps.step2Label")}</span>
              <h3 className="text-headline-md">{t("marketing.steps.step2Title")}</h3>
              <p className="text-on-surface-variant">{t("marketing.steps.step2Body")}</p>
              <div className="mt-2 flex h-[120px] items-center justify-center gap-2.5 rounded-2xl bg-surface-container-low py-3">
                {["perle", "corail", "kraft"].map((id) => (
                  <MiniQr key={id} id={id} text="https://trame.app" />
                ))}
              </div>
            </li>
            <li className="flex flex-col gap-2.5 rounded-[22px] border border-outline-variant bg-surface-container-lowest p-6">
              <span className="font-mono text-label-sm text-primary-container">{t("marketing.steps.step3Label")}</span>
              <h3 className="text-headline-md">{t("marketing.steps.step3Title")}</h3>
              <p className="text-on-surface-variant">{t("marketing.steps.step3Body")}</p>
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
          <h2 className="mb-8 text-headline-xl-mobile md:text-headline-xl">{t("marketing.features.title")}</h2>
          <div className="grid gap-px overflow-hidden rounded-[22px] border border-outline-variant bg-outline-variant sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
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
          <h2 className="mb-8 text-headline-xl-mobile md:text-headline-xl">{t("marketing.pricing.title")}</h2>
          <div className="grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-[22px] border border-outline-variant bg-surface-container-lowest p-7">
              <span className="font-mono text-label-sm uppercase tracking-[0.09em] opacity-70">{t("marketing.pricing.freeName")}</span>
              <p className="font-display text-[40px] font-bold tracking-[-0.03em]">
                {t("marketing.pricing.freePrice")}{" "}
                <span className="font-sans text-[14px] font-medium tracking-normal opacity-70">{t("marketing.pricing.freePeriod")}</span>
              </p>
              <ul className="flex flex-col gap-2 text-body-sm text-on-surface-variant">
                <li>
                  <span className="mr-2 text-primary-container">—</span>
                  {t("marketing.pricing.freeItem1")}
                </li>
                <li>
                  <span className="mr-2 text-primary-container">—</span>
                  {t("marketing.pricing.freeItem2", { count: FREE_DYNAMIC_LIMIT })}
                </li>
                <li>
                  <span className="mr-2 text-primary-container">—</span>
                  {t("marketing.pricing.freeItem3")}
                </li>
                <li>
                  <span className="mr-2 text-primary-container">—</span>
                  {t("marketing.pricing.freeItem4")}
                </li>
              </ul>
              <LocaleLink
                href="/inscription"
                className="mt-auto inline-flex h-11 items-center justify-center rounded-xl border border-outline-variant text-label-md hover:bg-surface-container-low"
              >
                {t("marketing.pricing.freeCta")}
              </LocaleLink>
            </div>
            <div className="flex flex-col gap-4 rounded-[22px] bg-tertiary-container p-7 text-on-tertiary">
              <span className="font-mono text-label-sm uppercase tracking-[0.09em] opacity-70">{t("marketing.pricing.proName")}</span>
              <p className="font-display text-[40px] font-bold tracking-[-0.03em]">
                {t("marketing.pricing.proPrice")}{" "}
                <span className="font-sans text-[14px] font-medium tracking-normal opacity-70">{t("marketing.pricing.proPeriod")}</span>
              </p>
              <ul className="flex flex-col gap-2 text-body-sm opacity-80">
                {[t("marketing.pricing.proItem1"), t("marketing.pricing.proItem2"), t("marketing.pricing.proItem3"), t("marketing.pricing.proItem4")].map(
                  (item) => (
                    <li key={item}>
                      <span className="mr-2 text-primary-container">—</span>
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <span className="mt-auto inline-flex h-11 items-center justify-center rounded-xl bg-primary-container text-label-md text-on-primary">
                {t("marketing.pricing.proSoon")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
