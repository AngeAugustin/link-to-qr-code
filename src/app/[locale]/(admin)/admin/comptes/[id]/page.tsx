import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountForm } from "@/components/admin/AccountForm";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Mark } from "@/components/admin/Mark";
import { getAccount } from "@/lib/admin-data";
import { getTranslator } from "@/lib/copy";
import { formatDay, formatNumber, formatWhen, placeLabel } from "@/lib/format";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const account = await getAccount(id);
  const t = getTranslator(locale);
  return { title: account?.user.name ?? t("admin.errors.notFound") };
}

export default async function AccountPage({ params }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const account = await getAccount(id);
  if (!account) notFound();

  const t = getTranslator(locale);
  const { user, ips } = account;
  const subscription = user.subscription;

  return (
    <div>
      <LocaleLink href="/admin/comptes" className="text-label-sm text-on-surface-variant hover:text-on-surface">
        {t("admin.account.back")}
      </LocaleLink>
      <header className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-headline-lg">{user.name}</h1>
          <p className="mt-1 truncate text-body-md text-on-surface-variant">{user.email}</p>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            {t("admin.account.created", { date: formatDay(user.createdAt, locale) })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Mark tone={user.plan === "PRO" ? "accent" : "quiet"}>{t(`admin.plan.${user.plan}`)}</Mark>
          <Mark tone={user.role === "ADMIN" ? "ink" : "quiet"}>
            {user.role === "ADMIN" ? t("admin.account.roleAdmin") : t("admin.account.roleUser")}
          </Mark>
          {user.disabledAt ? <Mark tone="signal">{t("admin.account.disabled")}</Mark> : null}
        </div>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <AccountForm
          userId={user.id}
          role={user.role}
          disabled={Boolean(user.disabledAt)}
          plan={user.plan}
          status={subscription?.status ?? "NONE"}
          priceCents={subscription?.priceCents ?? 0}
          periodEnd={subscription?.currentPeriodEnd ? subscription.currentPeriodEnd.toISOString().slice(0, 10) : ""}
          cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
          notes={subscription?.notes ?? ""}
          savedKey={user.updatedAt.toISOString()}
        />

        <div className="flex flex-col gap-6">
          <section className="border border-outline-variant bg-surface-container-lowest">
            <h2 className="border-b border-outline-variant px-4 py-3 font-display text-headline-md">{t("admin.account.ipsTitle")}</h2>
            {ips.length === 0 ? (
              <p className="px-4 py-4 text-body-sm text-on-surface-variant">{t("admin.account.ipsEmpty")}</p>
            ) : (
              <ul>
                {ips.map((row) => (
                  <li key={row.ip} className="border-t border-outline-variant first:border-t-0">
                    <LocaleLink
                      href={`/admin/visites?ip=${encodeURIComponent(row.ip)}&range=30`}
                      className="flex items-baseline justify-between gap-3 px-4 py-3 hover:bg-surface-container-low"
                    >
                      <span className="font-mono text-[13px] tabular-nums">{row.ip}</span>
                      <span className="text-body-sm text-on-surface-variant">
                        {Number(row.views) === 1
                          ? t("admin.account.viewOne")
                          : t("admin.account.views", { count: formatNumber(Number(row.views), locale) })}
                      </span>
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border border-outline-variant bg-surface-container-lowest">
            <h2 className="border-b border-outline-variant px-4 py-3 font-display text-headline-md">
              {t("admin.account.visitsTitle")}
            </h2>
            <p className="border-b border-outline-variant px-4 py-2 text-body-sm text-on-surface-variant">
              {t("admin.account.viewCount", { count: formatNumber(user._count.pageViews, locale) })}
            </p>
            {user.pageViews.length === 0 ? (
              <p className="px-4 py-4 text-body-sm text-on-surface-variant">{t("admin.account.visitsEmpty")}</p>
            ) : (
              <ul>
                {user.pageViews.map((view) => (
                  <li key={view.id} className="border-t border-outline-variant px-4 py-2.5 first:border-t-0">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate font-mono text-[13px]">{view.path}</span>
                      <span className="shrink-0 text-body-sm text-on-surface-variant">{formatWhen(view.createdAt, locale)}</span>
                    </span>
                    <span className="mt-0.5 block text-body-sm text-on-surface-variant">
                      {view.ip} · {placeLabel(view.city, view.country, locale, t("admin.overview.unknown"))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border border-outline-variant bg-surface-container-lowest">
            <h2 className="border-b border-outline-variant px-4 py-3 font-display text-headline-md">{t("admin.account.qrTitle")}</h2>
            <p className="border-b border-outline-variant px-4 py-2 text-body-sm text-on-surface-variant">
              {user._count.qrCodes === 1
                ? t("admin.account.qrCountOne")
                : t("admin.account.qrCount", { count: formatNumber(user._count.qrCodes, locale) })}
            </p>
            {user.qrCodes.length === 0 ? (
              <p className="px-4 py-4 text-body-sm text-on-surface-variant">{t("admin.account.qrEmpty")}</p>
            ) : (
              <ul>
                {user.qrCodes.map((qr) => (
                  <li key={qr.id} className="border-t border-outline-variant px-4 py-2.5 first:border-t-0">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate">{qr.name}</span>
                      <span className="shrink-0 font-mono text-label-sm tabular-nums">
                        {t("admin.account.scans", { count: formatNumber(qr.scans, locale) })}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-body-sm text-on-surface-variant">
                      {qr.dynamic ? t("admin.account.dynamic") : t("admin.account.static")} · {qr.destination}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
