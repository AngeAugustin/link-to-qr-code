"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { locales, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/path";

const LABELS: Record<Locale, string> = { fr: "FR", en: "EN" };

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={cn("flex rounded-lg border border-outline-variant bg-surface-container-low p-0.5", className)}
    >
      {locales.map((loc) => (
        <Link
          key={loc}
          href={switchLocalePath(pathname, loc)}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "min-w-[2.25rem] rounded-md px-2 py-1 text-center font-mono text-[12px] font-semibold transition-colors",
            loc === locale
              ? "bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/80"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          {LABELS[loc]}
        </Link>
      ))}
    </div>
  );
}
