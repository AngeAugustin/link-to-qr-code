import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioView } from "@/components/qr/StudioView";
import { getTranslator } from "@/lib/copy";
import { getSessionUser } from "@/lib/auth";
import { decodeDraft } from "@/lib/draft";
import { isLocale } from "@/lib/i18n/config";
import { QR_TEMPLATES, templateStyle } from "@/lib/qr-style";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ modele?: string; url?: string; draft?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getTranslator(locale);
  return {
    title: t("meta.studioTitle"),
    description: t("meta.studioDescription"),
  };
}

export default async function StudioPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getTranslator(locale);
  const sp = await searchParams;
  const user = await getSessionUser();
  const draft = decodeDraft(sp.draft);
  const template = QR_TEMPLATES.some((item) => item.id === sp.modele) ? sp.modele! : "fluide";
  const url = sp.url?.slice(0, 2048);

  const initial = draft ?? {
    name: "",
    destination: url || "https://",
    dynamic: !!user,
    style: templateStyle(template),
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-6">
        <p className="font-mono text-label-sm uppercase tracking-[0.09em] text-on-surface-variant">{t("marketing.studio.eyebrow")}</p>
        <h1 className="mt-1 text-headline-lg">{t("marketing.studio.title")}</h1>
      </div>
      <StudioView signedIn={!!user} initial={initial} />
    </div>
  );
}
