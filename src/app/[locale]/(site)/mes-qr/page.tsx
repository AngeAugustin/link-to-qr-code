import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QrCodesView } from "@/components/qr/QrCodesView";
import { getTranslator } from "@/lib/copy";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getTranslator(locale)("app.qrCodes.title") };
}

export default async function MyQrCodesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-8 sm:px-6">
      <QrCodesView />
    </div>
  );
}
