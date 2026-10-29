"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalePath } from "@/components/i18n/useLocalePath";
import { useT } from "@/components/i18n/LocaleProvider";
import { QrTemplateGallery } from "./QrTemplateGallery";

export function TemplatesBrowser() {
  const router = useRouter();
  const lp = useLocalePath();
  const t = useT();
  const [url, setUrl] = useState("https://atelier-noma.fr/menu");

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-col gap-space-lg sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="font-mono text-label-sm uppercase tracking-[0.09em] text-on-surface-variant">{t("marketing.templates.eyebrow")}</p>
          <h1 className="mt-2 text-headline-xl-mobile md:text-headline-xl">{t("marketing.templates.title")}</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">{t("marketing.templates.subtitle")}</p>
        </div>
        <div className="flex w-full flex-col gap-1.5 sm:w-80">
          <label htmlFor="gallery-url" className="text-label-sm text-on-surface-variant">
            {t("marketing.templates.urlLabel")}
          </label>
          <input
            id="gallery-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-md font-mono text-code-sm outline-none focus:border-primary-container"
          />
        </div>
      </div>
      <QrTemplateGallery
        text={url.trim() || "https://trame.app"}
        onUse={(id) => router.push(`${lp("/studio")}?modele=${id}&url=${encodeURIComponent(url.trim())}`)}
      />
    </div>
  );
}
