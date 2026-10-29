"use client";

import { useEffect, useState } from "react";
import { QrSvg } from "@/components/qr/QrSvg";
import { templateName, templateStyle } from "@/lib/qr-style";

const SHOWCASE = ["perle", "corail", "fluide"];

export function AuthMobileShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % SHOWCASE.length), 2800);
    return () => window.clearInterval(timer);
  }, []);

  const id = SHOWCASE[index];
  const style = { ...templateStyle(id), margin: 2 };

  return (
    <div className="relative mx-auto mb-8 aspect-square w-[120px] rounded-2xl border border-outline-variant bg-surface-container-lowest p-3 shadow-[0_8px_24px_-10px_rgba(18,21,19,0.15)] lg:hidden">
      <div className="grid h-full place-items-center rounded-xl" style={{ background: style.bg }}>
        <QrSvg text="https://trame.app" style={style} fit className="max-h-full" />
      </div>
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-container-lowest px-2 py-0.5 font-mono text-[10px] text-on-surface-variant ring-1 ring-outline-variant">
        {templateName(id)}
      </span>
    </div>
  );
}
