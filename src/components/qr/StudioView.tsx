"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/copy";
import { normalizeStyle } from "@/lib/qr-style";
import { encodeDraft } from "@/lib/draft";
import { QrStudio, isValidDestination, type QrStudioValue } from "./QrStudio";

type StudioViewProps = {
  signedIn: boolean;
  /** Edit an existing code; omitted to create one. */
  qrId?: string;
  initial: QrStudioValue;
};

type Saved = { id: string; dynamic: boolean; shortUrl: string };

export function StudioView({ signedIn, qrId, initial }: StudioViewProps) {
  const router = useRouter();
  const t = useT();
  const { toast } = useToast();
  const [value, setValue] = useState<QrStudioValue>(initial);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [loading, setLoading] = useState(!!qrId);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!qrId) return;
    void (async () => {
      try {
        const res = await fetch(`/api/qr-codes/${qrId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(res.status === 404 ? t("app.qrCodes.notFound") : (data.error ?? t("app.qrCodes.errorLoad")));
          return;
        }
        const qr = data.qrCode;
        setValue({ name: qr.name, destination: qr.destination, dynamic: qr.dynamic, style: normalizeStyle(qr.style) });
        setSaved({ id: qr.id, dynamic: qr.dynamic, shortUrl: qr.shortUrl });
      } catch {
        setError(t("common.networkError"));
      } finally {
        setLoading(false);
      }
    })();
  }, [qrId, t]);

  async function save() {
    if (!isValidDestination(value.destination.trim()) || !value.name.trim()) return;
    setSaving(true);
    try {
      const body = JSON.stringify({ ...value, name: value.name.trim(), destination: value.destination.trim() });
      const headers = { "Content-Type": "application/json" };
      const res = saved
        ? await fetch(`/api/qr-codes/${saved.id}`, { method: "PATCH", headers, body })
        : await fetch("/api/qr-codes", { method: "POST", headers, body });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? t("common.serverError"));
        return;
      }
      toast(t("app.qrStudio.saved"));
      if (!saved) {
        router.push(`/mes-qr/${data.qrCode.id}`);
        return;
      }
      setSaved({ id: data.qrCode.id, dynamic: data.qrCode.dynamic, shortUrl: data.qrCode.shortUrl });
    } catch {
      toast(t("common.networkError"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-body-md text-on-surface-variant">{t("common.loading")}</p>;
  if (error) return <div className="rounded-lg bg-error-container p-space-md text-on-error-container">{error}</div>;

  // Visitors keep their work through sign-up: the draft (minus any uploaded image) rides in the URL.
  const resumeUrl = `/studio?draft=${encodeDraft(value)}`;

  return (
    <div className="flex flex-col gap-space-md">
      {!signedIn ? (
        <div className="flex flex-col gap-space-sm rounded-2xl border border-primary-fixed-dim bg-primary-fixed px-space-lg py-space-md text-on-primary-fixed sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-label-md">{t("app.qrStudio.publicSaveTitle")}</p>
            <p className="text-body-sm opacity-80">{t("app.qrStudio.publicSaveBody")}</p>
          </div>
          <div className="flex shrink-0 gap-space-sm">
            <Link
              href={`/connexion?next=${encodeURIComponent(resumeUrl)}`}
              className="inline-flex h-9 items-center rounded-lg px-3 text-label-sm hover:underline"
            >
              {t("app.qrStudio.publicLogin")}
            </Link>
            <Link
              href={`/inscription?next=${encodeURIComponent(resumeUrl)}`}
              className="inline-flex h-9 items-center rounded-lg bg-tertiary-container px-3.5 text-label-sm text-on-tertiary hover:bg-tertiary"
            >
              {t("app.qrStudio.publicSaveCta")}
            </Link>
          </div>
        </div>
      ) : null}
      <QrStudio
        value={value}
        onChange={setValue}
        mode={signedIn ? "app" : "public"}
        canDynamic={signedIn}
        shortUrl={saved?.dynamic ? saved.shortUrl : null}
        onSave={signedIn ? () => void save() : undefined}
        saving={saving}
        saveLabel={saved ? t("app.qrStudio.save") : t("app.qrStudio.create")}
      />
    </div>
  );
}
