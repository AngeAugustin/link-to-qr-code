"use client";

import { LocaleLink } from "@/components/i18n/LocaleLink";

/** Trame mark: three finder-pattern corners and a few modules. */
export function Logo() {
  return (
    <LocaleLink
      href="/"
      className="flex items-center gap-2.5 font-display text-[21px] font-bold tracking-[-0.03em] text-on-surface"
    >
      <svg viewBox="0 0 26 26" className="h-[26px] w-[26px]" aria-hidden>
        <rect x="1" y="1" width="10" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <rect x="4.6" y="4.6" width="2.8" height="2.8" rx=".8" fill="currentColor" />
        <rect x="15" y="1" width="10" height="10" rx="5" fill="var(--c-accent)" />
        <rect x="1" y="15" width="10" height="10" rx="5" fill="currentColor" />
        <rect x="15" y="15" width="4" height="4" rx="1.2" fill="currentColor" />
        <rect x="21" y="21" width="4" height="4" rx="1.2" fill="currentColor" />
        <rect x="21" y="15" width="4" height="4" rx="2" fill="var(--c-accent)" />
      </svg>
      Trame
    </LocaleLink>
  );
}
