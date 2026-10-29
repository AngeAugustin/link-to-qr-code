import { LocaleLink } from "@/components/i18n/LocaleLink";
import { getTranslator } from "@/lib/copy";
import type { AdminOverview } from "@/lib/admin-data";
import { countryLabel, formatMoney, formatNumber, formatPercent, formatSignedPercent, formatUtcDay, utcDay } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/cn";

export function OverviewBoard({ locale, data }: { locale: Locale; data: AdminOverview }) {
  const t = getTranslator(locale);
  const rate = data.month.ips > 0 ? data.month.signups / data.month.ips : null;
  const busy = data.money.pastDue > 0 || data.atLimitCount > 0;
  const activeLabel =
    data.money.active === 1
      ? t(data.money.canceling > 0 ? "admin.overview.mrrDetailCancelOne" : "admin.overview.mrrDetailOne", {
          canceling: formatNumber(data.money.canceling, locale),
        })
      : t(data.money.canceling > 0 ? "admin.overview.mrrDetailCancel" : "admin.overview.mrrDetail", {
          count: formatNumber(data.money.active, locale),
          canceling: formatNumber(data.money.canceling, locale),
        });
  const attention = [
    data.money.pastDue === 1
      ? t("admin.overview.pastDueOne")
      : data.money.pastDue > 1
        ? t("admin.overview.pastDueMany", { count: formatNumber(data.money.pastDue, locale) })
        : "",
    data.atLimitCount === 1
      ? t("admin.overview.atLimitOne")
      : data.atLimitCount > 1
        ? t("admin.overview.atLimitMany", { count: formatNumber(data.atLimitCount, locale) })
        : "",
  ]
    .filter(Boolean)
    .join(", ");
  const max = Math.max(1, ...data.daily.map((day) => day.views));
  const hasTraffic = data.daily.some((day) => day.views > 0);
  const peak = data.daily.reduce((best, day) => (day.views > best.views ? day : best), data.daily[0]);

  return (
    <div>
      <section className="border border-outline-variant bg-surface-container-lowest">
        <header className="flex items-baseline justify-between gap-4 border-b border-outline-variant px-5 py-3">
          <h1 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-on-surface-variant">
            {t("admin.overview.sheetLabel")}
          </h1>
          <p className="font-mono text-label-sm tabular-nums text-on-surface-variant">{formatUtcDay(utcDay(0), locale)}</p>
        </header>
        <div className="grid divide-y divide-outline-variant md:grid-cols-3 md:divide-x md:divide-y-0">
          <SheetCell
            label={t("admin.overview.today")}
            value={formatNumber(data.today.views, locale)}
            detail={t("admin.overview.todayDetail", { count: formatNumber(data.today.ips, locale) })}
          />
          <SheetCell
            label={t("admin.overview.signups")}
            value={formatNumber(data.week.signups, locale)}
            detail={
              rate === null
                ? t("admin.overview.signupsDetailEmpty")
                : t("admin.overview.signupsDetail", { rate: formatPercent(rate, locale) })
            }
          />
          <SheetCell
            label={t("admin.overview.mrr")}
            value={formatMoney(data.money.mrrCents, locale)}
            detail={activeLabel}
          />
        </div>
        <p
          className={cn(
            "border-t border-outline-variant px-5 py-3 text-body-md",
            busy && "bg-tertiary-fixed text-on-tertiary-fixed",
          )}
        >
          {busy ? t("admin.overview.briefBusy", { items: attention }) : t("admin.overview.briefQuiet")}
        </p>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-headline-md">{t("admin.overview.rhythm")}</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              {t("admin.overview.rhythmHint")}
              {data.week.delta !== null
                ? ` · ${t("admin.overview.delta", { delta: formatSignedPercent(data.week.delta, locale) })}`
                : ""}
            </p>
          </div>
          <p className="font-mono text-label-sm tabular-nums text-on-surface-variant">
            {t("admin.overview.accountsLine", {
              total: formatNumber(data.accounts.total, locale),
              pro: formatNumber(data.accounts.pro, locale),
              free: formatNumber(data.accounts.free, locale),
            })}
          </p>
        </div>
        {hasTraffic ? (
          <div
            className="mt-4 flex h-24 items-end gap-1 border-b border-outline-variant"
            role="img"
            aria-label={t("admin.overview.rhythmSummary", {
              peak: formatNumber(peak?.views ?? 0, locale),
              day: peak ? formatUtcDay(new Date(`${peak.day}T00:00:00Z`), locale) : "",
            })}
          >
            {data.daily.map((day, index) => {
              const height = day.views === 0 ? 0 : Math.max(3, Math.round((day.views / max) * 84));
              const today = index === data.daily.length - 1;
              return (
                <div
                  key={day.day}
                  title={`${formatUtcDay(new Date(`${day.day}T00:00:00Z`), locale)} · ${formatNumber(day.views, locale)}`}
                  className={cn("min-w-0 flex-1", today ? "bg-primary-container" : "bg-tertiary-container")}
                  style={{ height }}
                />
              );
            })}
          </div>
        ) : (
          <p className="mt-4 border border-outline-variant bg-surface-container-lowest px-4 py-6 text-body-sm text-on-surface-variant">
            {t("admin.overview.pagesEmpty")}
          </p>
        )}
        <p className="mt-2 font-mono text-label-sm tabular-nums text-on-surface-variant">
          {t("admin.overview.productLine", {
            scans: formatNumber(data.week.scans, locale),
            created: formatNumber(data.week.qrCreated, locale),
          })}
        </p>
      </section>

      {data.pastDue.length > 0 || data.atLimit.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-headline-md">{t("admin.overview.attention")}</h2>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            {data.pastDue.length > 0 ? (
              <AttentionList
                title={t("admin.overview.pastDue")}
                tone="text-signal"
                rows={data.pastDue.map((account) => ({ ...account, meta: account.email }))}
              />
            ) : null}
            {data.atLimit.length > 0 ? (
              <AttentionList
                title={t("admin.overview.atLimit")}
                tone="text-primary"
                rows={data.atLimit.map((account) => ({ ...account, meta: account.email }))}
              />
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ListBlock title={t("admin.overview.pages")}>
          {data.topPages.length === 0 ? (
            <li className="px-4 py-4 text-body-sm text-on-surface-variant">{t("admin.overview.pagesEmpty")}</li>
          ) : (
            data.topPages.map((page) => (
              <li key={page.path} className="flex items-baseline justify-between gap-4 border-t border-outline-variant px-4 py-2.5">
                <span className="truncate font-mono text-[13px]">{page.path}</span>
                <span className="shrink-0 font-mono text-label-sm tabular-nums text-on-surface-variant">
                  {t("admin.overview.pageStat", {
                    views: formatNumber(page.views, locale),
                    ips: formatNumber(page.ips, locale),
                  })}
                </span>
              </li>
            ))
          )}
        </ListBlock>
        <div className="flex flex-col gap-8">
          <ListBlock title={t("admin.overview.sources")}>
            {data.sources.length === 0 ? (
              <li className="px-4 py-4 text-body-sm text-on-surface-variant">{t("admin.overview.pagesEmpty")}</li>
            ) : (
              data.sources.map((source) => (
                <li key={source.label} className="flex items-baseline justify-between gap-4 border-t border-outline-variant px-4 py-2.5">
                  <span className="truncate">{source.label === "direct" ? t("admin.overview.direct") : source.label}</span>
                  <span className="font-mono text-label-sm tabular-nums">{formatNumber(source.views, locale)}</span>
                </li>
              ))
            )}
          </ListBlock>
          {data.countries.length > 0 ? (
            <ListBlock title={t("admin.overview.countries")}>
              {data.countries.map((country) => (
                <li key={country.code || "unknown"} className="flex items-baseline justify-between gap-4 border-t border-outline-variant px-4 py-2.5">
                  <span>{country.code ? countryLabel(country.code, locale, t("admin.overview.unknown")) : t("admin.overview.unknown")}</span>
                  <span className="font-mono text-label-sm tabular-nums">{formatNumber(country.views, locale)}</span>
                </li>
              ))}
            </ListBlock>
          ) : null}
          {data.devices.length > 0 ? (
            <ListBlock title={t("admin.overview.devices")}>
              {data.devices.map((device) => (
                <li key={device.device} className="flex items-baseline justify-between gap-4 border-t border-outline-variant px-4 py-2.5">
                  <span>{deviceName(t, device.device)}</span>
                  <span className="font-mono text-label-sm tabular-nums">{formatNumber(device.views, locale)}</span>
                </li>
              ))}
            </ListBlock>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SheetCell({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="px-5 py-5">
      <p className="text-label-sm text-on-surface-variant">{label}</p>
      <p className="mt-2 font-mono text-[2.25rem] leading-none tracking-tight tabular-nums">{value}</p>
      <p className="mt-2 text-body-sm text-on-surface-variant">{detail}</p>
    </div>
  );
}

function AttentionList({
  title,
  tone,
  rows,
}: {
  title: string;
  tone: string;
  rows: { id: string; name: string; meta: string }[];
}) {
  return (
    <div className="border border-outline-variant bg-surface-container-lowest">
      <h3 className={cn("border-b border-outline-variant px-4 py-2.5 text-label-sm", tone)}>{title}</h3>
      <ul>
        {rows.map((row) => (
          <li key={row.id} className="border-t border-outline-variant first:border-t-0">
            <LocaleLink href={`/admin/comptes/${row.id}`} className="block px-4 py-3 hover:bg-surface-container-low">
              <span className="block text-body-md">{row.name}</span>
              <span className="block truncate text-body-sm text-on-surface-variant">{row.meta}</span>
            </LocaleLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-headline-md">{title}</h2>
      <ul className="mt-3 border border-outline-variant bg-surface-container-lowest">{children}</ul>
    </section>
  );
}

function deviceName(t: ReturnType<typeof getTranslator>, device: string) {
  const key = `admin.devices.${device}`;
  const label = t(key);
  return label === key ? device : label;
}
