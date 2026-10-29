import type { Metadata } from "next";
import { TemplatesBrowser } from "@/components/qr/TemplatesBrowser";

export const metadata: Metadata = {
  title: "Modèles",
  description: "Douze modèles de QR codes à personnaliser, du plus sobre au plus expressif.",
};

export default function TemplatesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6">
      <TemplatesBrowser />
    </div>
  );
}
