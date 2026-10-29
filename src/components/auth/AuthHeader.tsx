"use client";

import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useT } from "@/components/i18n/LocaleProvider";
import { Logo } from "@/components/site/Logo";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";

export function AuthHeader() {
  const t = useT();
  return (
    <header className="relative z-10 mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center justify-between gap-2 px-4 sm:h-16 sm:gap-4 sm:px-6">
      <div className="min-w-0">
        <Logo />
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <LocaleSwitcher />
        <LocaleLink
          href="/"
          className="rounded-lg px-2 py-1.5 text-label-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface sm:px-3 sm:text-label-md"
        >
          {t("nav.home")}
        </LocaleLink>
      </div>
    </header>
  );
}
