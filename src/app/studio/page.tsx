import type { Metadata } from "next";
import { StudioView } from "@/components/qr/StudioView";
import { getSessionUser } from "@/lib/auth";
import { decodeDraft } from "@/lib/draft";
import { QR_TEMPLATES, templateStyle } from "@/lib/qr-style";

export const metadata: Metadata = {
  title: "Studio",
  description: "Collez un lien et personnalisez votre QR code : motif, coins, couleurs, logo et cadre.",
};

type Props = {
  searchParams: Promise<{ modele?: string; url?: string; draft?: string }>;
};

export default async function StudioPage({ searchParams }: Props) {
  const params = await searchParams;
  const user = await getSessionUser();
  const draft = decodeDraft(params.draft);
  const template = QR_TEMPLATES.some((t) => t.id === params.modele) ? params.modele! : "fluide";
  const url = params.url?.slice(0, 2048);

  const initial = draft ?? {
    name: "",
    destination: url || "https://",
    dynamic: !!user,
    style: templateStyle(template),
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-6">
        <p className="font-mono text-label-sm uppercase tracking-[0.09em] text-on-surface-variant">Studio</p>
        <h1 className="mt-1 text-headline-lg">Nouveau QR code</h1>
      </div>
      <StudioView signedIn={!!user} initial={initial} />
    </div>
  );
}
