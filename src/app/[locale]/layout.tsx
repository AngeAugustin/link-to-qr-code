import { notFound } from "next/navigation";
import { LocaleHtmlLang } from "@/components/i18n/LocaleHtmlLang";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { isLocale } from "@/lib/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <LocaleProvider locale={locale}>
      <LocaleHtmlLang locale={locale} />
      {children}
    </LocaleProvider>
  );
}
