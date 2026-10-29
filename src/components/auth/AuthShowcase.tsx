"use client";

import { useEffect, useState } from "react";
import { QrSvg } from "@/components/qr/QrSvg";
import { useT } from "@/components/i18n/LocaleProvider";
import { scanScore, templateName, templateStyle } from "@/lib/qr-style";
import { cn } from "@/lib/cn";

const SHOWCASE = ["perle", "corail", "fluide", "minuit"];

export function AuthShowcase() {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % SHOWCASE.length), 2800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const id = SHOWCASE[index];
  const style = { ...templateStyle(id), margin: 2 };
  const text = "https://trame.app";

  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center lg:py-12 xl:py-16">
      <div className="relative mx-auto aspect-square w-full max-w-[360px] rounded-[28px] border border-outline-variant bg-surface-container-lowest p-7 shadow-[0_12px_32px_-12px_rgba(18,21,19,0.18)]">
        <div className="grid h-full place-items-center rounded-2xl" style={{ background: style.bg }}>
          <QrSvg text={text} style={style} title={t("auth.qrPreviewTitle", { name: templateName(id) })} fit className="max-h-full" />
        </div>
        <span className="absolute -left-2 top-5 rounded-lg bg-tertiary-container px-2.5 py-1.5 font-mono text-[12px] text-on-tertiary xl:-left-3.5">
          {t("auth.templateBadge", { name: templateName(id) })}
        </span>
        <span className="absolute -right-2 bottom-6 rounded-lg bg-primary-container px-2.5 py-1.5 font-mono text-[12px] text-on-primary xl:-right-3.5">
          {t("auth.readability", { score: scanScore(style).score })}
        </span>
      </div>
      <div role="group" aria-label={t("auth.previewStyles")} className="mx-auto mt-5 flex max-w-[360px] flex-wrap justify-center gap-1.5">
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
              "h-8 rounded-full border px-3 text-[13px] transition-colors",
              i === index
                ? "border-on-surface font-semibold text-on-surface"
                : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline",
            )}
          >
            {templateName(tid)}
          </button>
        ))}
      </div>
      <ul className="mx-auto mt-8 max-w-[22rem] space-y-2 text-body-sm text-on-surface-variant">
        {[t("auth.showcaseBenefit1"), t("auth.showcaseBenefit2"), t("auth.showcaseBenefit3")].map((item) => (
          <li key={item} className="before:mr-1.5 before:font-bold before:text-primary-container before:content-['✓']">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
