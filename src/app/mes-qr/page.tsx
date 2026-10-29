import type { Metadata } from "next";
import { QrCodesView } from "@/components/qr/QrCodesView";

export const metadata: Metadata = { title: "Mes QR codes" };

export default function MyQrCodesPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-8 sm:px-6">
      <QrCodesView />
    </div>
  );
}
