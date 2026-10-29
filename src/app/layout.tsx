import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ToastProvider } from "@/components/ui/Toast";
import { getSessionUser } from "@/lib/auth";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  title: {
    default: "Trame · QR codes à votre image",
    template: "%s · Trame",
  },
  description:
    "Transformez un lien en QR code entièrement personnalisable : modèles, formes, couleurs, logo et cadre, avec QR dynamiques et statistiques de scans.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <html lang="fr" className={`${geist.variable} ${geistMono.variable} ${bricolage.variable} h-full`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ToastProvider>
          <SiteHeader user={user} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
