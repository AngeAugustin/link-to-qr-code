import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Ledger, td, th, tr } from "@/components/admin/Ledger";
import { Mark } from "@/components/admin/Mark";
import { adminHref, Pager } from "@/components/admin/Pager";
import { PurgeVisitsButton } from "@/components/admin/PurgeVisitsButton";
import { listVisits, readPage, readRange } from "@/lib/admin-data";
import { getTranslator } from "@/lib/copy";
import { formatNumber, formatWhen, placeLabel } from "@/lib/format";
import { isLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/path";
import { referrerLabel } from "@/lib/visits";
import { cn } from "@/lib/cn";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; ip?: string; range?: string; bots?: string; page?: string }>;
};

const fieldClass =
  "h-10 min-w-[16rem] flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-sm outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-fixed";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getTranslator(locale)("admin.visits.title") };
}

export default async function VisitsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const t = getTranslator(locale);
  const q = sp.q?.trim() ?? "";
  const ip = sp.ip?.trim() ?? "";
  const range = readRange(sp.range);
  const bots = sp.bots === "1";
  const result = await listVisits({ q, ip, range, bots, page: readPage(sp.page) });
  const direct = t("admin.visits.direct");

  return (
    <div>
      <header>
        {ip ? (
          <>
            <LocaleLink href={adminHref("/admin/visites", { range, bots: bots ? "1" : undefined })} className="text-label-sm text-on-surface-variant hover:text-on-surface">
              {t("admin.visits.all")}
            </LocaleLink>
            <h1 className="mt-2 font-mono text-headline-lg tracking-tight tabular-nums">{ip}</h1>
            {result.dossier?.first && result.dossier.last ? (
              <p className="mt-1 text-body-sm text-on-surface-variant">
                {t("admin.visits.ipMeta", {
                  first: formatWhen(result.dossier.first, locale),
                  last: formatWhen(result.dossier.last, locale),
                  count: formatNumber(result.dossier.views, locale),
                })}
              </p>
            ) : (
              <p className="mt-1 text-body-sm text-on-surface-variant">{t("admin.visits.ipUnknown")}</p>
            )}
          </>
        ) : (
          <>
            <h1 className="font-display text-headline-lg">{t("admin.visits.title")}</h1>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              {t("admin.visits.subtitle", {
                views: formatNumber(result.total, locale),
                ips: formatNumber(result.ips, locale),
              })}
            </p>
          </>
        )}
      </header>

      {ip && result.dossier ? (
        <section className="mt-4 border border-outline-variant bg-surface-container-lowest">
          <h2 className="border-b border-outline-variant px-4 py-2.5 text-label-sm text-on-surface-variant">
            {t("admin.visits.ipAccounts")}
          </h2>
          {result.dossier.accounts.length === 0 ? (
            <p className="px-4 py-3 text-body-sm text-on-surface-variant">{t("admin.visits.ipNoAccount")}</p>
          ) : (
            <ul>
              {result.dossier.accounts.map((account) => (
                <li key={account.id} className="border-t border-outline-variant first:border-t-0">
                  <LocaleLink href={`/admin/comptes/${account.id}`} className="block px-4 py-2.5 hover:bg-surface-container-low">
                    <span className="block text-body-md">{account.name}</span>
                    <span className="block text-body-sm text-on-surface-variant">{account.email}</span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {([1, 7, 30] as const).map((value) => (
          <LocaleLink
            key={value}
            href={adminHref("/admin/visites", { range: value, q, ip, bots: bots ? "1" : undefined })}
            aria-current={range === value ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1 text-label-sm",
              range === value ? "bg-tertiary-container text-on-tertiary" : "bg-surface-container text-on-surface-variant hover:text-on-surface",
            )}
          >
            {t(`admin.visits.range${value}`)}
          </LocaleLink>
        ))}
        <LocaleLink
          href={adminHref("/admin/visites", { range, q, ip, bots: bots ? undefined : "1" })}
          className="rounded-full bg-surface-container px-3 py-1 text-label-sm text-on-surface-variant hover:text-on-surface"
        >
          {bots ? t("admin.visits.humans") : t("admin.visits.withBots")}
        </LocaleLink>
      </div>

      <form action={localizedPath(locale, "/admin/visites")} method="get" className="mt-4 flex flex-wrap items-end gap-2">
        <input type="hidden" name="range" value={range} />
        {bots ? <input type="hidden" name="bots" value="1" /> : null}
        <label className="flex min-w-[16rem] flex-1 flex-col gap-1.5">
          <span className="sr-only">{t("admin.visits.search")}</span>
          <input
            name="q"
            defaultValue={q}
            placeholder={t("admin.visits.searchPh")}
            spellCheck={false}
            className={fieldClass}
          />
        </label>
        <button type="submit" className="h-10 rounded-lg bg-tertiary-container px-4 text-label-md text-on-tertiary hover:bg-tertiary">
          {t("admin.accounts.filter")}
        </button>
      </form>

      {result.rows.length === 0 ? (
        <p className="mt-6 border border-outline-variant bg-surface-container-lowest px-4 py-8 text-body-sm text-on-surface-variant">
          {t("admin.visits.empty")}
        </p>
      ) : (
        <Ledger caption={t("admin.visits.title")} className="mt-4">
          <thead>
            <tr>
              <th className={th}>{t("admin.visits.colWhen")}</th>
              <th className={th}>{t("admin.visits.colPath")}</th>
              <th className={th}>{t("admin.visits.colIp")}</th>
              <th className={th}>{t("admin.visits.colWhere")}</th>
              <th className={th}>{t("admin.visits.colDevice")}</th>
              <th className={th}>{t("admin.visits.colAccount")}</th>
              <th className={th}>{t("admin.visits.colRef")}</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((view) => {
              const deviceKey = `admin.devices.${view.device}`;
              const deviceLabel = t(deviceKey);
              return (
                <tr key={view.id} className={tr}>
                  <td className={`${td} whitespace-nowrap font-mono text-[12px] tabular-nums`}>{formatWhen(view.createdAt, locale)}</td>
                  <td className={`${td} font-mono text-[13px]`}>{view.path}</td>
                  <td className={td}>
                    <LocaleLink
                      href={adminHref("/admin/visites", { ip: view.ip, range: 30, bots: bots ? "1" : undefined })}
                      className="font-mono text-[13px] tabular-nums text-primary hover:text-primary-container"
                    >
                      {view.ip}
                    </LocaleLink>
                  </td>
                  <td className={td}>{placeLabel(view.city, view.country, locale, "—")}</td>
                  <td className={td} title={view.userAgent ?? undefined}>
                    {deviceLabel === deviceKey ? view.device : deviceLabel}
                    {view.bot ? (
                      <span className="ml-2">
                        <Mark tone="quiet">{t("admin.visits.bot")}</Mark>
                      </span>
                    ) : null}
                  </td>
                  <td className={td}>
                    {view.user ? (
                      <LocaleLink href={`/admin/comptes/${view.user.id}`} className="hover:text-primary">
                        {view.user.name}
                      </LocaleLink>
                    ) : (
                      <span className="text-on-surface-variant">{t("admin.visits.anonymous")}</span>
                    )}
                  </td>
                  <td className={`${td} max-w-[12rem] truncate text-on-surface-variant`}>{referrerLabel(view.referrer, direct)}</td>
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
        hrefFor={(page) => adminHref("/admin/visites", { q, ip, range, bots: bots ? "1" : undefined, page })}
      />

      <div className="mt-8 max-w-2xl border-t border-outline-variant pt-4">
        <p className="text-body-sm text-on-surface-variant">{t("admin.visits.privacy")}</p>
        <div className="mt-2">
          <PurgeVisitsButton />
        </div>
      </div>
    </div>
  );
}
