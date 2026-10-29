import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getTranslator } from "@/lib/copy";
import { getSessionUser } from "@/lib/auth";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { safeNext } from "@/lib/safe-next";
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getTranslator(locale);
  return { title: t("auth.pageLogin") };
}

export default async function Page({ params, searchParams }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const { next } = await searchParams;
  if (await getSessionUser()) redirect(safeNext(next, locale));
  return <AuthForm mode="login" next={next} />;
}
