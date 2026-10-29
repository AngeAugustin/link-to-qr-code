import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudioView } from "@/components/qr/StudioView";
import { Icon } from "@/components/ui/Icon";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_STYLE } from "@/lib/qr-style";

export const metadata: Metadata = { title: "Modifier le QR code" };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditQrCodePage({ params }: Props) {
  const { id } = await params;
  const user = await getSessionUser();
  const qr = user
    ? await prisma.qrCode.findFirst({ where: { id, userId: user.id }, select: { name: true } })
    : null;
  if (!qr) notFound();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-6">
        <Link href="/mes-qr" className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-on-surface">
          <Icon name="arrow_back" className="text-[18px]" /> Retour à mes QR codes
        </Link>
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
