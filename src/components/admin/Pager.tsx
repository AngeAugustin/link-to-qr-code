import { LocaleLink } from "@/components/i18n/LocaleLink";

export function adminHref(path: string, params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || (key === "page" && Number(value) <= 1)) continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export function Pager({
  page,
  pages,
  hrefFor,
  prev,
  next,
  label,
}: {
  page: number;
  pages: number;
  hrefFor: (page: number) => string;
  prev: string;
  next: string;
  label: string;
}) {
  if (pages <= 1) return null;
  const link = "text-label-md text-primary hover:text-primary-container";
  const quiet = "text-label-md text-on-surface-variant/40";
  return (
    <nav aria-label={label} className="flex items-center justify-between gap-3 pt-4">
      {page > 1 ? (
        <LocaleLink href={hrefFor(page - 1)} className={link}>
          {prev}
        </LocaleLink>
      ) : (
        <span className={quiet}>{prev}</span>
      )}
      <p className="font-mono text-label-sm tabular-nums text-on-surface-variant">
        {page} / {pages}
      </p>
      {page < pages ? (
        <LocaleLink href={hrefFor(page + 1)} className={link}>
          {next}
        </LocaleLink>
      ) : (
        <span className={quiet}>{next}</span>
      )}
    </nav>
  );
}
