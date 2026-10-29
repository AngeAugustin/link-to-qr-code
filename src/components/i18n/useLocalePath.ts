"use client";

import { useCallback } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizedPath } from "@/lib/i18n/path";

export function useLocalePath() {
  const locale = useLocale();
  return useCallback((path: string) => localizedPath(locale, path), [locale]);
}
