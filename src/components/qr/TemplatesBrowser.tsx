"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrTemplateGallery } from "./QrTemplateGallery";

export function TemplatesBrowser() {
  const router = useRouter();
  const [url, setUrl] = useState("https://atelier-noma.fr/menu");

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-wrap items-end justify-between gap-space-lg">
        <div className="max-w-2xl">
          <p className="font-mono text-label-sm uppercase tracking-[0.09em] text-on-surface-variant">Galerie</p>
          <h1 className="mt-2 text-headline-xl-mobile md:text-headline-xl">Modèles</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Chaque modèle encode votre lien. Choisissez une base : tout reste personnalisable dans le studio.
          </p>
        </div>
        <div className="flex w-full flex-col gap-1.5 sm:w-80">
          <label htmlFor="gallery-url" className="text-label-sm text-on-surface-variant">
            Aperçu avec le lien
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
        onUse={(id) => router.push(`/studio?modele=${id}&url=${encodeURIComponent(url.trim())}`)}
      />
    </div>
  );
}
