import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import { localizedPath, stripLocalePath } from "@/lib/i18n/path";

/** Only same-site paths are accepted as a post-login destination (no open redirect). */
export function safeNext(next: string | undefined, locale: Locale = defaultLocale) {
  const fallback = localizedPath(locale, "/mes-qr");
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  const bare = stripLocalePath(next);
  if (!bare.startsWith("/") || bare.startsWith("//")) return fallback;
  return localizedPath(locale, bare);
}
