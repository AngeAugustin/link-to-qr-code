"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalePath } from "@/components/i18n/useLocalePath";
import { useT } from "@/components/i18n/LocaleProvider";
import { QrSvg } from "@/components/qr/QrSvg";
import { scanScore, templateName, templateStyle } from "@/lib/qr-style";
import { cn } from "@/lib/cn";

const SHOWCASE = ["fluide", "perle", "corail", "bauhaus", "minuit"];

export function HeroShowcase() {
  const router = useRouter();
  const lp = useLocalePath();
  const t = useT();
  const [url, setUrl] = useState("https://atelier-noma.fr/menu");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % SHOWCASE.length), 2800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const id = SHOWCASE[index];
  const style = { ...templateStyle(id), margin: 2 };
  const text = url.trim() || "https://trame.app";

  return (
    <div className="grid items-center gap-10 py-10 sm:gap-12 sm:py-12 md:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
      <div className="min-w-0">
        <p className="font-mono text-label-sm uppercase tracking-[0.09em] text-on-surface-variant">{t("marketing.hero.eyebrow")}</p>
        <h1 className="mt-4 text-display-lg-mobile md:text-display-lg">
          {t("marketing.hero.titleLine1")}
          <br />
          {t("marketing.hero.titleLine2")} <span className="text-primary-container">{t("marketing.hero.titleHighlight")}</span>
        </h1>
        <p className="mt-5 max-w-[34em] text-body-lg text-on-surface-variant">{t("marketing.hero.subtitle")}</p>
        <form
          className="mt-8 flex w-full max-w-[560px] flex-col gap-2 rounded-2xl border border-outline-variant bg-surface-container-lowest p-2 shadow-[0_12px_32px_-12px_rgba(18,21,19,0.18)] sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`${lp("/studio")}?modele=${id}&url=${encodeURIComponent(url.trim())}`);
          }}
        >
          <label htmlFor="hero-url" className="sr-only">
            {t("marketing.hero.urlLabel")}
          </label>
          <input
            id="hero-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("marketing.hero.urlPlaceholder")}
            className="h-12 min-w-0 flex-1 bg-transparent px-3 text-[16px] outline-none"
          />
          <button
            type="submit"
            className="h-12 w-full shrink-0 rounded-xl bg-primary-container px-5 text-label-md text-on-primary hover:bg-primary sm:w-auto"
          >
            {t("marketing.hero.cta")}
          </button>
        </form>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-body-sm text-on-surface-variant">
          {[t("marketing.hero.bullet1"), t("marketing.hero.bullet2"), t("marketing.hero.bullet3")].map((item) => (
            <li key={item} className="before:mr-1.5 before:font-bold before:text-primary-container before:content-['✓']">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid justify-items-center gap-4">
        <div className="relative aspect-square w-full max-w-[min(400px,100%)] rounded-[22px] border border-outline-variant bg-surface-container-lowest p-5 shadow-[0_12px_32px_-12px_rgba(18,21,19,0.18)] sm:rounded-[28px] sm:p-8">
          <div className="grid h-full place-items-center rounded-2xl" style={{ background: style.bg }}>
            <QrSvg text={text} style={style} title={t("marketing.hero.qrTitle", { url: text })} fit className="max-h-full" />
          </div>
          <span className="absolute left-2 top-3 max-w-[calc(100%-1rem)] truncate rounded-lg bg-tertiary-container px-2 py-1 font-mono text-[10px] text-on-tertiary sm:top-5 sm:max-w-none sm:px-2.5 sm:py-1.5 sm:text-[12px] sm:-left-3.5">
            {t("marketing.hero.modelBadge", { name: templateName(id) })}
          </span>
          <span className="absolute bottom-4 right-2 rounded-lg bg-primary-container px-2 py-1 font-mono text-[10px] text-on-primary sm:bottom-6 sm:px-2.5 sm:py-1.5 sm:text-[12px] sm:-right-3.5">
            {t("marketing.hero.readability", { score: scanScore(style).score })}
          </span>
        </div>
        <div role="group" aria-label={t("marketing.hero.previewStyles")} className="flex flex-wrap justify-center gap-1.5">
          {SHOWCASE.map((tid, i) => (
            <button
              key={tid}
              type="button"
              aria-pressed={i === index}
              onClick={() => {
                setIndex(i);
                setPaused(true);
              }}
              className={cn(
                "h-8 rounded-full border px-3 text-[13px]",
                i === index
                  ? "border-on-surface font-semibold text-on-surface"
                  : "border-outline-variant bg-surface-container-lowest text-on-surface-variant",
              )}
            >
              {templateName(tid)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
