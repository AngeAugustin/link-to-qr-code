"use client";

import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useT } from "@/components/i18n/LocaleProvider";
import { Logo } from "./Logo";

export function SiteFooter() {
  const t = useT();

  return (
    <footer className="border-t border-outline-variant">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-body-sm text-on-surface-variant">{t("nav.footerTagline")}</p>
        </div>
        <nav aria-label={t("nav.footer")} className="grid grid-cols-2 gap-x-12 gap-y-2 text-body-sm">
          <LocaleLink href="/studio" className="text-on-surface-variant hover:text-on-surface">
            {t("nav.studio")}
          </LocaleLink>
          <LocaleLink href="/modeles" className="text-on-surface-variant hover:text-on-surface">
            {t("nav.templates")}
          </LocaleLink>
          <LocaleLink href="/#offres" className="text-on-surface-variant hover:text-on-surface">
            {t("nav.pricing")}
          </LocaleLink>
          <LocaleLink href="/inscription" className="text-on-surface-variant hover:text-on-surface">
            {t("nav.signUp")}
          </LocaleLink>
        </nav>
      </div>
    </footer>
  );
}
