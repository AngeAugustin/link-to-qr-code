"use client";

import { useRef, useState } from "react";
import type { SessionUser } from "@/lib/auth";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { useT } from "@/components/i18n/LocaleProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Logo } from "./Logo";

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const t = useT();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const logoutFormRef = useRef<HTMLFormElement>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = user?.name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const LINKS = [
    { href: "/modeles", label: t("nav.templates") },
    { href: "/studio", label: t("nav.studio") },
    { href: "/#offres", label: t("nav.pricing") },
  ];

  function openLogoutConfirm() {
    menuRef.current?.removeAttribute("open");
    setLogoutOpen(true);
  }

  function confirmLogout() {
    setLoggingOut(true);
    logoutFormRef.current?.requestSubmit();
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl min-w-0 items-center gap-3 px-4 sm:h-16 sm:gap-6 sm:px-6">
          <div className="min-w-0 shrink">
            <Logo />
          </div>
          <nav aria-label={t("nav.main")} className="mr-auto hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <LocaleLink
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-label-md font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              >
                {l.label}
              </LocaleLink>
            ))}
            {user ? (
              <LocaleLink
                href="/mes-qr"
                className="rounded-lg px-3 py-1.5 text-label-md font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              >
                {t("nav.myQrCodes")}
              </LocaleLink>
            ) : null}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <LocaleSwitcher className="hidden sm:flex" />
            {user ? (
              <>
                <LocaleLink
                  href="/studio"
                  className="hidden h-9 items-center rounded-[10px] bg-tertiary-container px-3.5 text-label-md text-on-tertiary hover:bg-tertiary sm:inline-flex"
                >
                  {t("nav.createQr")}
                </LocaleLink>
                <details ref={menuRef} className="relative">
                  <summary
                    aria-label={t("nav.accountOf", { name: user.name })}
                    className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-full bg-primary-fixed text-label-sm font-bold text-primary-container [&::-webkit-details-marker]:hidden"
                  >
                    {initials}
                  </summary>
                  <div className="absolute right-0 z-50 mt-2 w-[min(15rem,calc(100vw-2rem))] rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg">
                    <p className="truncate px-2 pt-1 text-label-md text-on-surface">{user.name}</p>
                    <p className="truncate px-2 pb-2 text-body-sm text-on-surface-variant">{user.email}</p>
                    <LocaleLink href="/mes-qr" className="block rounded-lg px-2 py-2 text-body-md hover:bg-surface-container-low">
                      {t("nav.myQrCodes")}
                    </LocaleLink>
                    {user.role === "ADMIN" ? (
                      <LocaleLink href="/admin" className="block rounded-lg px-2 py-2 text-body-md text-primary hover:bg-surface-container-low">
                        {t("nav.admin")}
                      </LocaleLink>
                    ) : null}
                    <LocaleLink
                      href="/modeles"
                      className="block rounded-lg px-2 py-2 text-body-md hover:bg-surface-container-low md:hidden"
                    >
                      {t("nav.templates")}
                    </LocaleLink>
                    <button
                      type="button"
                      onClick={openLogoutConfirm}
                      className="w-full rounded-lg px-2 py-2 text-left text-body-md text-error hover:bg-surface-container-low"
                    >
                      {t("nav.logout")}
                    </button>
                  </div>
                </details>
              </>
            ) : (
              <>
                <LocaleLink
                  href="/connexion"
                  className="hidden h-9 items-center rounded-[10px] px-3 text-label-md text-on-surface-variant hover:text-on-surface sm:inline-flex"
                >
                  {t("nav.login")}
                </LocaleLink>
                <LocaleLink
                  href="/studio"
                  className="inline-flex h-9 max-w-[8.75rem] items-center truncate rounded-[10px] bg-tertiary-container px-2.5 text-label-sm text-on-tertiary hover:bg-tertiary sm:max-w-none sm:px-3.5 sm:text-label-md"
                >
                  <span className="truncate sm:overflow-visible">{t("nav.createQr")}</span>
                </LocaleLink>
              </>
            )}
          </div>
        </div>
        <nav
          aria-label={t("nav.mobile")}
          className="no-scrollbar flex items-center gap-1 overflow-x-auto border-t border-outline-variant px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
        >
          {[...LINKS, ...(user ? [{ href: "/mes-qr", label: t("nav.myQrCodes") }] : [{ href: "/connexion", label: t("nav.login") }])].map(
            (l) => (
              <LocaleLink
                key={l.href}
                href={l.href}
                className="shrink-0 rounded-lg px-3 py-1 text-label-sm text-on-surface-variant hover:text-on-surface"
              >
                {l.label}
              </LocaleLink>
            ),
          )}
          <div className="ml-auto shrink-0 sm:hidden">
            <LocaleSwitcher />
          </div>
        </nav>
      </header>

      <form ref={logoutFormRef} action="/api/auth/logout" method="post" className="hidden" aria-hidden />

      <ConfirmModal
        open={logoutOpen}
        title={t("nav.logoutConfirmTitle")}
        description={t("nav.logoutConfirmBody")}
        confirmLabel={t("nav.logout")}
        tone="danger"
        confirming={loggingOut}
        onConfirm={confirmLogout}
        onCancel={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
      />
    </>
  );
}
