import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Ledger, td, th, tr } from "@/components/admin/Ledger";
import { Mark, statusTone } from "@/components/admin/Mark";
import { adminHref, Pager } from "@/components/admin/Pager";
import { getOverview, listSubscriptions, readPage, readStatus } from "@/lib/admin-data";
import { getTranslator } from "@/lib/copy";
import { formatMoney, formatUtcDay } from "@/lib/format";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";
import { cn } from "@/lib/cn";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

const FILTERS = ["", "ACTIVE", "TRIALING", "PAST_DUE", "CANCELED"] as const;

const fieldClass =
  "h-10 min-w-[14rem] flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-sm outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-fixed";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getTranslator(locale)("admin.subscriptions.title") };
}

export default async function SubscriptionsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const t = getTranslator(locale);
  const q = sp.q?.trim() ?? "";
  const status = readStatus(sp.status);
  const [result, overview] = await Promise.all([
    listSubscriptions({ q, status, page: readPage(sp.page) }),
    getOverview(),
  ]);

  return (
    <div>
      <header>
        <h1 className="font-display text-headline-lg">{t("admin.subscriptions.title")}</h1>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          {overview.money.active === 1
            ? t("admin.subscriptions.subtitleOne", { mrr: formatMoney(overview.money.mrrCents, locale) })
            : t("admin.subscriptions.subtitle", {
                mrr: formatMoney(overview.money.mrrCents, locale),
                active: overview.money.active,
              })}
        </p>
        <p className="mt-2 max-w-2xl text-body-sm text-on-surface-variant">{t("admin.subscriptions.intro")}</p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = (status ?? "") === filter;
          return (
            <LocaleLink
              key={filter || "all"}
              href={adminHref("/admin/abonnements", { status: filter, q })}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-1 text-label-sm",
                active ? "bg-tertiary-container text-on-tertiary" : "bg-surface-container text-on-surface-variant hover:text-on-surface",
              )}
            >
              {filter ? t(`admin.status.${filter}`) : t("admin.subscriptions.all")}
            </LocaleLink>
          );
        })}
      </div>

      <form action={localizedPath(locale, "/admin/abonnements")} method="get" className="mt-4 flex flex-wrap items-end gap-2">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <label className="flex min-w-[14rem] flex-1 flex-col gap-1.5">
          <span className="sr-only">{t("admin.accounts.search")}</span>
          <input name="q" defaultValue={q} placeholder={t("admin.accounts.searchPh")} className={fieldClass} />
        </label>
        <button type="submit" className="h-10 rounded-lg bg-tertiary-container px-4 text-label-md text-on-tertiary hover:bg-tertiary">
          {t("admin.accounts.filter")}
        </button>
      </form>

      {result.rows.length === 0 ? (
        <p className="mt-6 border border-outline-variant bg-surface-container-lowest px-4 py-8 text-body-sm text-on-surface-variant">
          {t("admin.subscriptions.empty")}
        </p>
      ) : (
        <Ledger caption={t("admin.subscriptions.title")} className="mt-4">
          <thead>
            <tr>
              <th className={th}>{t("admin.subscriptions.colAccount")}</th>
              <th className={th}>{t("admin.subscriptions.colStatus")}</th>
              <th className={th}>{t("admin.subscriptions.colPrice")}</th>
              <th className={th}>{t("admin.subscriptions.colPeriod")}</th>
              <th className={th}>{t("admin.subscriptions.colCancel")}</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.id} className={tr}>
                <td className={td}>
                  <LocaleLink href={`/admin/comptes/${row.user.id}`} className="font-medium hover:text-primary">
                    {row.user.name}
                  </LocaleLink>
                  <span className="mt-0.5 block truncate text-on-surface-variant">{row.user.email}</span>
                </td>
                <td className={td}>
                  <Mark tone={statusTone(row.status)}>{t(`admin.status.${row.status}`)}</Mark>
                  <span className="mt-1 block text-on-surface-variant">{t(`admin.plan.${row.user.plan}`)}</span>
                </td>
                <td className={`${td} font-mono tabular-nums`}>{formatMoney(row.priceCents, locale)}</td>
                <td className={td}>{row.currentPeriodEnd ? formatUtcDay(row.currentPeriodEnd, locale) : "—"}</td>
                <td className={td}>{row.cancelAtPeriodEnd ? t("admin.subscriptions.cancelYes") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </Ledger>
      )}

      <Pager
        page={result.page}
        pages={result.pages}
        prev={t("admin.pager.prev")}
        next={t("admin.pager.next")}
        label={t("admin.pager.label")}
        hrefFor={(page) => adminHref("/admin/abonnements", { q, status, page })}
      />
    </div>
  );
}
