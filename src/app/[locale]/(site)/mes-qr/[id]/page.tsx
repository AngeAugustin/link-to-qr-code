import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioView } from "@/components/qr/StudioView";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Icon } from "@/components/ui/Icon";
import { getTranslator } from "@/lib/copy";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isLocale } from "@/lib/i18n/config";
import { DEFAULT_STYLE } from "@/lib/qr-style";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getTranslator(locale)("app.qrCodes.editTitle") };
}

export default async function EditQrCodePage({ params }: Props) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const t = getTranslator(localeParam);
  const user = await getSessionUser();
  const qr = user
    ? await prisma.qrCode.findFirst({ where: { id, userId: user.id }, select: { name: true } })
    : null;
  if (!qr) notFound();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-6">
        <LocaleLink href="/mes-qr" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-on-surface">
          <Icon name="arrow_back" className="text-[18px]" /> {t("app.qrCodes.back")}
        </LocaleLink>
        <h1 className="mt-2 text-headline-lg">{qr.name}</h1>
      </div>
      <StudioView
        signedIn
        qrId={id}
        initial={{ name: qr.name, destination: "https://", dynamic: false, style: DEFAULT_STYLE }}
      />
    </div>
  );
}
