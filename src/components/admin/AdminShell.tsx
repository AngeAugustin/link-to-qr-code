import type { SessionUser } from "@/lib/auth";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { getTranslator } from "@/lib/copy";
import type { Locale } from "@/lib/i18n/config";
import { AdminNav } from "./AdminNav";

export function AdminShell({
  locale,
  user,
  children,
}: {
  locale: Locale;
  user: SessionUser;
  children: React.ReactNode;
}) {
  const t = getTranslator(locale);

  return (
    <div className="flex min-h-dvh flex-1 flex-col md:flex-row">
      <aside className="sticky top-0 z-30 flex shrink-0 flex-col bg-tertiary-container text-on-tertiary md:h-dvh md:w-56">
        <div className="flex items-center justify-between gap-3 px-5 py-4 md:block md:px-5 md:pb-6 md:pt-6">
          <LocaleLink href="/admin" className="block">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-on-tertiary/60">{t("admin.brand")}</p>
            <p className="font-display text-headline-md leading-none text-on-tertiary">{t("admin.name")}</p>
          </LocaleLink>
          <p className="mt-1 hidden text-body-sm text-on-tertiary/70 md:block">{t("admin.subtitle")}</p>
          <div className="md:hidden">
            <LocaleSwitcher />
          </div>
        </div>
        <div className="no-scrollbar hidden md:block">
          <AdminNav variant="rail" />
        </div>
        <div className="no-scrollbar flex overflow-x-auto px-2 pb-3 md:hidden">
          <AdminNav variant="bar" />
        </div>
        <div className="mt-auto hidden flex-col gap-3 border-t border-on-tertiary/15 px-5 py-5 md:flex">
          <LocaleSwitcher />
          <div className="min-w-0">
            <p className="truncate text-label-md text-on-tertiary">{user.name}</p>
            <p className="truncate text-body-sm text-on-tertiary/70">{user.email}</p>
          </div>
          <LocaleLink href="/" className="text-body-sm text-on-tertiary/80 hover:text-on-tertiary">
            {t("admin.backToSite")}
          </LocaleLink>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="text-body-sm text-on-tertiary/80 hover:text-on-tertiary">
              {t("nav.logout")}
            </button>
          </form>
        </div>
      </aside>
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant px-4 py-3 md:hidden">
        <LocaleLink href="/" className="text-label-sm text-on-surface-variant">
          {t("admin.backToSite")}
        </LocaleLink>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="text-label-sm text-on-surface-variant">
            {t("nav.logout")}
          </button>
        </form>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
