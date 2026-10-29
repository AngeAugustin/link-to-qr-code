import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplatesBrowser } from "@/components/qr/TemplatesBrowser";
import { getTranslator } from "@/lib/copy";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getTranslator(locale);
  return {
    title: t("meta.templatesTitle"),
    description: t("meta.templatesDescription"),
  };
}

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6">
      <TemplatesBrowser />
    </div>
  );
}
