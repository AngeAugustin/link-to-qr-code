import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OverviewBoard } from "@/components/admin/OverviewBoard";
import { getOverview } from "@/lib/admin-data";
import { getTranslator } from "@/lib/copy";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getTranslator(locale)("admin.nav.overview") };
}

export default async function AdminHomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getOverview();
  return <OverviewBoard locale={locale} data={data} />;
}
