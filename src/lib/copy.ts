import { en } from "@/messages/en";
import { fr } from "@/messages/fr";
import type { Locale } from "@/lib/i18n/config";

export const MESSAGES = { fr, en } as const;

type Messages = typeof fr | typeof en;
type Vars = Record<string, string | number>;

function translate(messages: Messages, path: string, vars?: Vars): string {
  let cur: unknown = messages;
  for (const part of path.split(".")) {
    if (cur && typeof cur === "object" && part in cur) cur = (cur as Record<string, unknown>)[part];
    else return path;
  }
  if (typeof cur !== "string") return path;
  return vars ? cur.replace(/\{(\w+)\}/g, (_, k: string) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`)) : cur;
}

export type Translate = (path: string, vars?: Vars) => string;

export function createTranslator(locale: Locale): Translate {
  const messages = MESSAGES[locale];
  return (path, vars) => translate(messages, path, vars);
}

export function getTranslator(locale: Locale): Translate {
  return createTranslator(locale);
}

/** @deprecated Use useT from LocaleProvider or getTranslator on the server. */
export function t(path: string, vars?: Vars): string {
  return translate(fr, path, vars);
}

/** @deprecated Use useT from LocaleProvider. */
export function useT() {
  return t;
}
