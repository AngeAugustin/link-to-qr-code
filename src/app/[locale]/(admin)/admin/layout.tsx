import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSessionUser } from "@/lib/auth";
import { getTranslator } from "@/lib/copy";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: getTranslator(locale)("admin.metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const user = await getSessionUser();
  const next = localizedPath(locale, "/admin");
  if (!user) redirect(`${localizedPath(locale, "/connexion")}?next=${encodeURIComponent(next)}`);
  if (user.role !== "ADMIN") redirect(localizedPath(locale, "/"));

  return (
    <AdminShell locale={locale} user={user}>
      {children}
    </AdminShell>
  );
}
