import { isLocale } from "@/lib/i18n/config";
import { stripLocalePath } from "@/lib/i18n/path";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { appBaseUrl, deviceFromUserAgent } from "@/lib/qr-codes";

export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const raw = forwarded || headers.get("x-real-ip")?.trim() || headers.get("cf-connecting-ip")?.trim() || "";
  if (!raw || raw.length > 64 || /[\s,]/.test(raw)) return "local";
  return raw;
}

export function isBot(userAgent: string | null) {
  if (!userAgent) return false;
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|lighthouse/i.test(userAgent);
}

function geoFromHeaders(headers: Headers) {
  const city = headers.get("x-vercel-ip-city");
  return {
    country: headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry"),
    city: city ? decodeURIComponent(city) : null,
  };
}

/** Keep the site that sent the visitor. Drop query strings, they often carry search terms. */
export function cleanReferrer(value: string | undefined | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

export function isInternalHost(host: string) {
  const hostname = host.replace(/^www\./, "").split(":")[0]?.toLowerCase() ?? "";
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") return true;
  try {
    const app = new URL(appBaseUrl());
    return app.host.toLowerCase() === host.toLowerCase() || app.hostname.toLowerCase() === hostname;
  } catch {
    return false;
  }
}

/** Label for the ledger: a previous page on this site, or the external host. */
export function referrerLabel(referrer: string | null, direct: string) {
  if (!referrer) return direct;
  try {
    const url = new URL(referrer);
    if (isInternalHost(url.host)) return stripLocalePath(url.pathname);
    return url.host.replace(/^www\./, "");
  } catch {
    return direct;
  }
}

const PATH_OK = /^\/[A-Za-z0-9/_-]*$/;

/** Record one public page view. Ignores anything that is not a normal site path. */
export async function recordPageView(request: Request, pathInput: string, referrerInput: string | undefined) {
  const pathOnly = pathInput.split("?")[0]?.split("#")[0] ?? "";
  if (!pathOnly.startsWith("/") || pathOnly.startsWith("//") || pathOnly.includes("\\") || pathOnly.length > 200) return;
  const bare = stripLocalePath(pathOnly);
  if (!PATH_OK.test(bare) || bare.startsWith("/admin") || bare.startsWith("/api") || bare.startsWith("/r")) return;

  const segment = pathOnly.split("/")[1];
  const locale = segment && isLocale(segment) ? segment : null;
  const headers = request.headers;
  const userAgent = headers.get("user-agent");
  const geo = geoFromHeaders(headers);
  const user = await getSessionUser();

  await prisma.pageView.create({
    data: {
      path: bare,
      locale,
      referrer: cleanReferrer(referrerInput),
      ip: clientIp(headers),
      userAgent: userAgent ? userAgent.slice(0, 300) : null,
      device: deviceFromUserAgent(userAgent),
      bot: isBot(userAgent),
      country: geo.country,
      city: geo.city,
      userId: user?.id,
    },
  });
}
