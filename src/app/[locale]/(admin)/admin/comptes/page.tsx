import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Ledger, td, th, tr } from "@/components/admin/Ledger";
import { Mark } from "@/components/admin/Mark";
import { adminHref, Pager } from "@/components/admin/Pager";
import { listAccounts, readPage, readPlan } from "@/lib/admin-data";
import { getTranslator } from "@/lib/copy";
import { formatDay, formatWhen } from "@/lib/format";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; plan?: string; state?: string; page?: string }>;
};

const fieldClass =
  "h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-sm outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-fixed";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getTranslator(locale)("admin.accounts.title") };
}

export default async function AccountsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const t = getTranslator(locale);
  const q = sp.q?.trim() ?? "";
  const plan = readPlan(sp.plan);
  const state = sp.state === "disabled" || sp.state === "active" ? sp.state : undefined;
  const result = await listAccounts({ q, plan, state, page: readPage(sp.page) });

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-headline-lg">{t("admin.accounts.title")}</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            {t("admin.accounts.subtitle", { count: result.total })}
          </p>
        </div>
      </header>

      <form action={localizedPath(locale, "/admin/comptes")} method="get" className="mt-5 flex flex-wrap items-end gap-2">
        <label className="flex min-w-[14rem] flex-1 flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.accounts.search")}</span>
          <input name="q" defaultValue={q} placeholder={t("admin.accounts.searchPh")} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.accounts.plan")}</span>
          <select name="plan" defaultValue={plan ?? ""} className={fieldClass}>
            <option value="">{t("admin.accounts.allPlans")}</option>
            <option value="FREE">{t("admin.plan.FREE")}</option>
            <option value="PRO">{t("admin.plan.PRO")}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.accounts.status")}</span>
          <select name="state" defaultValue={state ?? ""} className={fieldClass}>
            <option value="">{t("admin.accounts.allStatuses")}</option>
            <option value="active">{t("admin.accounts.active")}</option>
            <option value="disabled">{t("admin.accounts.disabled")}</option>
          </select>
        </label>
        <button type="submit" className="h-10 rounded-lg bg-tertiary-container px-4 text-label-md text-on-tertiary hover:bg-tertiary">
          {t("admin.accounts.filter")}
        </button>
      </form>

      {result.rows.length === 0 ? (
        <p className="mt-6 border border-outline-variant bg-surface-container-lowest px-4 py-8 text-body-sm text-on-surface-variant">
          {t("admin.accounts.empty")}
        </p>
      ) : (
        <Ledger caption={t("admin.accounts.title")} className="mt-4">
          <thead>
            <tr>
              <th className={th}>{t("admin.accounts.colAccount")}</th>
              <th className={th}>{t("admin.accounts.colPlan")}</th>
              <th className={th}>{t("admin.accounts.colSub")}</th>
              <th className={th}>{t("admin.accounts.colQr")}</th>
              <th className={th}>{t("admin.accounts.colSeen")}</th>
              <th className={th}>{t("admin.accounts.colCreated")}</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((account) => {
              const seen = account.pageViews[0];
              return (
                <tr key={account.id} className={tr}>
                  <td className={td}>
                    <LocaleLink href={`/admin/comptes/${account.id}`} className="font-medium text-on-surface hover:text-primary">
                      {account.name}
                    </LocaleLink>
                    <span className="mt-0.5 block truncate text-on-surface-variant">{account.email}</span>
                    {account.role === "ADMIN" ? (
                      <span className="mt-1 inline-block">
                        <Mark tone="ink">{t("admin.account.roleAdmin")}</Mark>
                      </span>
                    ) : null}
                  </td>
                  <td className={td}>
                    <Mark tone={account.plan === "PRO" ? "accent" : "quiet"}>{t(`admin.plan.${account.plan}`)}</Mark>
                    {account.disabledAt ? (
                      <span className="mt-1 block">
                        <Mark tone="signal">{t("admin.account.disabled")}</Mark>
                      </span>
                    ) : null}
                  </td>
                  <td className={td}>
                    {account.subscription ? t(`admin.status.${account.subscription.status}`) : t("admin.status.NONE")}
                  </td>
                  <td className={`${td} font-mono tabular-nums`}>{account._count.qrCodes}</td>
                  <td className={td}>
                    {seen ? (
                      <>
                        <span className="block">{formatWhen(seen.createdAt, locale)}</span>
                        <span className="font-mono text-[12px] text-on-surface-variant">{seen.ip}</span>
                      </>
                    ) : (
                      t("admin.accounts.never")
                    )}
                  </td>
                  <td className={td}>{formatDay(account.createdAt, locale)}</td>
                </tr>
              );
            })}
          </tbody>
        </Ledger>
      )}

      <Pager
        page={result.page}
        pages={result.pages}
        prev={t("admin.pager.prev")}
        next={t("admin.pager.next")}
        label={t("admin.pager.label")}
        hrefFor={(page) => adminHref("/admin/comptes", { q, plan, state, page })}
      />
    </div>
  );
}
