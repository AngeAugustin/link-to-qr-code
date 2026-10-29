import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales } from "@/lib/i18n/config";
import { localeFromPathname, localizedPath, stripLocalePath } from "@/lib/i18n/path";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

function preferredLocale(request: NextRequest): typeof defaultLocale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;
  const header = request.headers.get("accept-language") ?? "";
  if (/\ben\b/i.test(header) && !/\bfr\b/i.test(header.split(",")[0] ?? "")) return "en";
  return defaultLocale;
}

function pathnameHasLocale(pathname: string) {
  return locales.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`));
}

/** Locale prefix + signed-in guard for /mes-qr. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/r/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (!pathnameHasLocale(pathname)) {
    const locale = preferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(locale, pathname);
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const locale = localeFromPathname(pathname);
  const res = NextResponse.next();
  res.cookies.set(LOCALE_COOKIE, locale, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });

  const bare = stripLocalePath(pathname);
  if (!bare.startsWith("/mes-qr")) return res;

  const userId = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (userId) return res;

  const url = request.nextUrl.clone();
  url.pathname = localizedPath(locale, "/connexion");
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
