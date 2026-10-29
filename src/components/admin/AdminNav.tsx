"use client";

import { usePathname } from "next/navigation";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useT } from "@/components/i18n/LocaleProvider";
import { stripLocalePath } from "@/lib/i18n/path";
import { cn } from "@/lib/cn";

export function AdminNav({ variant }: { variant: "rail" | "bar" }) {
  const pathname = usePathname();
  const bare = stripLocalePath(pathname);
  const t = useT();
  const links = [
    { href: "/admin", label: t("admin.nav.overview") },
    { href: "/admin/comptes", label: t("admin.nav.accounts") },
    { href: "/admin/abonnements", label: t("admin.nav.subscriptions") },
    { href: "/admin/visites", label: t("admin.nav.visits") },
  ];

  return (
    <nav aria-label={t("admin.navLabel")} className={variant === "rail" ? "flex flex-col gap-0.5 px-3" : "flex min-w-0 gap-1"}>
      {links.map((link) => {
        const active = link.href === "/admin" ? bare === "/admin" : bare === link.href || bare.startsWith(`${link.href}/`);
        return (
          <LocaleLink
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap text-label-md",
              variant === "rail"
                ? cn(
                    "border-l-2 px-3 py-2",
                    active
                      ? "border-on-tertiary bg-on-tertiary/10 text-on-tertiary"
                      : "border-transparent text-on-tertiary/70 hover:text-on-tertiary",
                  )
                : cn(
                    "rounded-md px-2.5 py-1.5",
                    active ? "bg-on-tertiary/15 text-on-tertiary" : "text-on-tertiary/70 hover:text-on-tertiary",
                  ),
            )}
          >
            {link.label}
          </LocaleLink>
        );
      })}
    </nav>
  );
}
