"use client";

import { createContext, useContext, useMemo } from "react";
import { createTranslator, type Translate } from "@/lib/copy";
import type { Locale } from "@/lib/i18n/config";

const LocaleContext = createContext<Locale>("fr");
const TranslateContext = createContext<Translate>(createTranslator("fr"));

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = useMemo(() => createTranslator(locale), [locale]);
  return (
    <LocaleContext.Provider value={locale}>
      <TranslateContext.Provider value={t}>{children}</TranslateContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT(): Translate {
  return useContext(TranslateContext);
}
