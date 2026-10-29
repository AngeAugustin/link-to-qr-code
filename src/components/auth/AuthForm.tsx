"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthMobileShowcase } from "@/components/auth/AuthMobileShowcase";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { safeNext } from "@/lib/safe-next";

const inputClass =
  "h-12 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 text-[16px] outline-none transition-[border-color,box-shadow] focus:border-primary-container focus:ring-4 focus:ring-primary-fixed";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const target = safeNext(next, locale);
  const register = mode === "register";
  const switchQuery = next ? `?next=${encodeURIComponent(target)}` : "";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch(register ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.code === "invalid" && register
            ? t("auth.invalidRegister")
            : data.code === "accountDisabled"
              ? t("auth.accountDisabled")
              : (data.error ?? t("common.serverError")),
        );
        return;
      }
      router.push(target);
      router.refresh();
    } catch {
      setError(t("common.networkError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="animate-[rise_0.35s_ease-out] min-w-0 w-full">
      <AuthMobileShowcase />
      <p className="font-mono text-label-sm uppercase tracking-[0.09em] text-on-surface-variant">{t("auth.eyebrow")}</p>
      <h1 className="mt-3 text-headline-xl-mobile md:text-headline-xl">
        {register ? t("auth.registerTitleBefore") : t("auth.loginTitleBefore")}{" "}
        <span className="text-primary-container">{t("auth.titleHighlight")}</span>
      </h1>
      <p className="mt-3 text-body-md text-on-surface-variant">
        {register ? t("auth.registerSubtitle") : t("auth.loginSubtitle")}
      </p>

      <div
        role="tablist"
        aria-label={t("auth.tabsLabel")}
        className="mt-8 flex rounded-xl border border-outline-variant bg-surface-container-low p-1"
      >
        <LocaleLink
          role="tab"
          aria-selected={!register}
          href={`/connexion${switchQuery}`}
          className={cn(
            "flex h-10 flex-1 items-center justify-center rounded-lg text-label-md transition-colors",
            !register
              ? "bg-surface-container-lowest font-semibold text-on-surface shadow-sm ring-1 ring-outline-variant/80"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          {t("auth.loginTab")}
        </LocaleLink>
        <LocaleLink
          role="tab"
          aria-selected={register}
          href={`/inscription${switchQuery}`}
          className={cn(
            "flex h-10 flex-1 items-center justify-center rounded-lg text-label-md transition-colors",
            register
              ? "bg-surface-container-lowest font-semibold text-on-surface shadow-sm ring-1 ring-outline-variant/80"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          {t("auth.registerTab")}
        </LocaleLink>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-6 flex flex-col gap-space-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-space-lg shadow-[0_12px_32px_-12px_rgba(18,21,19,0.18)] focus-within:ring-4 focus-within:ring-primary-fixed/40"
      >
        {register ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-name" className="text-label-sm text-on-surface-variant">
              {t("auth.name")}
            </label>
            <input id="auth-name" name="name" required maxLength={80} autoComplete="name" className={inputClass} />
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-email" className="text-label-sm text-on-surface-variant">
            {t("auth.email")}
          </label>
          <input id="auth-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-password" className="text-label-sm text-on-surface-variant">
            {t("auth.password")}
          </label>
          <div className="relative">
            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={register ? 8 : 1}
              autoComplete={register ? "new-password" : "current-password"}
              className={cn(inputClass, "pr-12")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden>
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {register ? <p className="text-body-sm text-on-surface-variant">{t("auth.passwordMin")}</p> : null}
        </div>
        {error ? (
          <p role="alert" className="rounded-xl bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "h-12 rounded-xl bg-tertiary-container text-label-md text-on-tertiary transition-colors hover:bg-tertiary",
            pending && "opacity-60",
          )}
        >
          {pending ? t("auth.pending") : register ? t("auth.submitRegister") : t("auth.submitLogin")}
        </button>
      </form>

      <p className="mt-5 text-center font-mono text-[11px] leading-relaxed text-on-surface-variant sm:text-body-sm">
        {t("auth.trustLine")}
      </p>
    </div>
  );
}
