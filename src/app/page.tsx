import { redirect } from "next/navigation";
import { defaultLocale, LOCALE_COOKIE, isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";
import { cookies } from "next/headers";

export default async function RootRedirectPage() {
  const jar = await cookies();
  const stored = jar.get(LOCALE_COOKIE)?.value;
  const locale = stored && isLocale(stored) ? stored : defaultLocale;
  redirect(localizedPath(locale, "/"));
}
