import { defaultLocale, isLocale, type Locale } from "./config";

/** Path without locale prefix, always starts with `/` (or `/` for home). */
export function stripLocalePath(pathname: string): string {
  const parts = pathname.split("/");
  if (parts.length > 1 && isLocale(parts[1] ?? "")) {
    const rest = parts.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  const hashIdx = normalized.indexOf("#");
  const pathOnly = hashIdx >= 0 ? normalized.slice(0, hashIdx) : normalized;
  const hash = hashIdx >= 0 ? normalized.slice(hashIdx) : "";
  const bare = stripLocalePath(pathOnly);
  if (bare === "/") return `/${locale}${hash}`;
  return `/${locale}${bare}${hash}`;
}

export function localeFromPathname(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  return seg && isLocale(seg) ? seg : defaultLocale;
}

export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  return localizedPath(nextLocale, stripLocalePath(pathname));
}
