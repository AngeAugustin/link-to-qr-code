import { cache } from "react";
import type { Plan, Prisma, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { FREE_DYNAMIC_LIMIT } from "@/lib/qr-codes";
import { utcDay } from "@/lib/format";
import { isInternalHost } from "@/lib/visits";

export const PAGE_SIZE = 20;

const STATUSES = ["NONE", "TRIALING", "ACTIVE", "PAST_DUE", "CANCELED"] as const;
const PLANS = ["FREE", "PRO"] as const;

export function readPage(value: string | undefined) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export function readPlan(value: string | undefined): Plan | undefined {
  return PLANS.find((plan) => plan === value);
}

export function readStatus(value: string | undefined): SubscriptionStatus | undefined {
  return STATUSES.find((status) => status === value);
}

export function readRange(value: string | undefined): 1 | 7 | 30 {
  if (value === "1" || value === "30") return Number(value) as 1 | 30;
  return 7;
}

export type AttentionAccount = { id: string; name: string; email: string };

export type AdminOverview = {
  today: { views: number; ips: number };
  week: { views: number; ips: number; signups: number; scans: number; qrCreated: number; delta: number | null };
  month: { views: number; ips: number; signups: number };
  accounts: { total: number; pro: number; free: number; disabled: number };
  money: { mrrCents: number; active: number; trialing: number; pastDue: number; canceling: number };
  daily: { day: string; views: number }[];
  topPages: { path: string; views: number; ips: number }[];
  sources: { label: string; views: number }[];
  countries: { code: string; views: number }[];
  devices: { device: string; views: number }[];
  pastDue: AttentionAccount[];
  atLimit: AttentionAccount[];
  atLimitCount: number;
};

function num(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

export const getOverview = cache(async (): Promise<AdminOverview> => {
  const today = utcDay(0);
  const week = utcDay(-6);
  const prev = utcDay(-13);
  const month = utcDay(-29);

  const [traffic, people, money, scans, qrCreated, dailyRows, pageRows, sourceRows, countryRows, deviceRows, pastDueRows, atLimitRows, atLimitCountRows] =
    await Promise.all([
      prisma.$queryRaw<
        Array<{
          today_views: number;
          today_ips: number;
          week_views: number;
          week_ips: number;
          prev_views: number;
          month_views: number;
          month_ips: number;
        }>
      >`
        SELECT
          count(*) FILTER (WHERE "createdAt" >= ${today} AND bot = false)::int AS today_views,
          count(DISTINCT ip) FILTER (WHERE "createdAt" >= ${today} AND bot = false)::int AS today_ips,
          count(*) FILTER (WHERE "createdAt" >= ${week} AND bot = false)::int AS week_views,
          count(DISTINCT ip) FILTER (WHERE "createdAt" >= ${week} AND bot = false)::int AS week_ips,
          count(*) FILTER (WHERE "createdAt" >= ${prev} AND "createdAt" < ${week} AND bot = false)::int AS prev_views,
          count(*) FILTER (WHERE "createdAt" >= ${month} AND bot = false)::int AS month_views,
          count(DISTINCT ip) FILTER (WHERE "createdAt" >= ${month} AND bot = false)::int AS month_ips
        FROM "PageView"
      `,
      prisma.$queryRaw<
        Array<{
          total: number;
          pro: number;
          free: number;
          disabled: number;
          signups_week: number;
          signups_month: number;
        }>
      >`
        SELECT
          count(*)::int AS total,
          count(*) FILTER (WHERE plan = 'PRO' AND "disabledAt" IS NULL)::int AS pro,
          count(*) FILTER (WHERE plan = 'FREE' AND "disabledAt" IS NULL)::int AS free,
          count(*) FILTER (WHERE "disabledAt" IS NOT NULL)::int AS disabled,
          count(*) FILTER (WHERE role = 'USER' AND "createdAt" >= ${week})::int AS signups_week,
          count(*) FILTER (WHERE role = 'USER' AND "createdAt" >= ${month})::int AS signups_month
        FROM "User"
      `,
      prisma.$queryRaw<
        Array<{ mrr: number; active: number; trialing: number; past_due: number; canceling: number }>
      >`
        SELECT
          COALESCE(sum(s."priceCents") FILTER (WHERE s.status = 'ACTIVE' AND u."disabledAt" IS NULL AND u.plan = 'PRO'), 0)::int AS mrr,
          count(*) FILTER (WHERE s.status = 'ACTIVE' AND u."disabledAt" IS NULL AND u.plan = 'PRO')::int AS active,
          count(*) FILTER (WHERE s.status = 'TRIALING' AND u."disabledAt" IS NULL)::int AS trialing,
          count(*) FILTER (WHERE s.status = 'PAST_DUE' AND u."disabledAt" IS NULL)::int AS past_due,
          count(*) FILTER (WHERE s.status = 'ACTIVE' AND s."cancelAtPeriodEnd" = true AND u."disabledAt" IS NULL)::int AS canceling
        FROM "Subscription" s
        JOIN "User" u ON u.id = s."userId"
      `,
      prisma.qrScan.count({ where: { createdAt: { gte: week } } }),
      prisma.qrCode.count({ where: { createdAt: { gte: week } } }),
      prisma.$queryRaw<Array<{ day: string; views: number }>>`
        SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day,
               count(*)::int AS views
        FROM "PageView"
        WHERE "createdAt" >= ${month} AND bot = false
        GROUP BY 1
        ORDER BY 1
      `,
      prisma.$queryRaw<Array<{ path: string; views: number; ips: number }>>`
        SELECT path, count(*)::int AS views, count(DISTINCT ip)::int AS ips
        FROM "PageView"
        WHERE "createdAt" >= ${week} AND bot = false
        GROUP BY path
        ORDER BY views DESC
        LIMIT 8
      `,
      prisma.$queryRaw<Array<{ source: string; views: number }>>`
        SELECT COALESCE(
                 NULLIF(split_part(substring(referrer from 'https?://([^/]+)'), ':', 1), ''),
                 'direct'
               ) AS source,
               count(*)::int AS views
        FROM "PageView"
        WHERE "createdAt" >= ${week} AND bot = false
        GROUP BY 1
        ORDER BY views DESC
        LIMIT 12
      `,
      prisma.$queryRaw<Array<{ code: string; views: number }>>`
        SELECT COALESCE(country, '') AS code, count(*)::int AS views
        FROM "PageView"
        WHERE "createdAt" >= ${week} AND bot = false
        GROUP BY 1
        ORDER BY views DESC
        LIMIT 6
      `,
      prisma.$queryRaw<Array<{ device: string; views: number }>>`
        SELECT device, count(*)::int AS views
        FROM "PageView"
        WHERE "createdAt" >= ${week} AND bot = false
        GROUP BY device
        ORDER BY views DESC
      `,
      prisma.subscription.findMany({
        where: { status: "PAST_DUE", user: { disabledAt: null } },
        select: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { currentPeriodEnd: "asc" },
        take: 8,
      }),
      prisma.$queryRaw<AttentionAccount[]>`
        SELECT u.id, u.name, u.email
        FROM "User" u
        JOIN "QrCode" q ON q."userId" = u.id AND q.dynamic = true
        WHERE u.plan = 'FREE' AND u."disabledAt" IS NULL
        GROUP BY u.id, u.name, u.email
        HAVING count(q.id) >= ${FREE_DYNAMIC_LIMIT}
        ORDER BY count(q.id) DESC
        LIMIT 8
      `,
      prisma.$queryRaw<Array<{ total: number }>>`
        SELECT count(*)::int AS total FROM (
          SELECT u.id
          FROM "User" u
          JOIN "QrCode" q ON q."userId" = u.id AND q.dynamic = true
          WHERE u.plan = 'FREE' AND u."disabledAt" IS NULL
          GROUP BY u.id
          HAVING count(q.id) >= ${FREE_DYNAMIC_LIMIT}
        ) capped
      `,
    ]);

  const t = traffic[0];
  const p = people[0];
  const m = money[0];
  const prevViews = num(t?.prev_views);
  const weekViews = num(t?.week_views);
  const byDay = new Map(dailyRows.map((row) => [row.day, num(row.views)]));
  const daily = Array.from({ length: 30 }, (_, index) => {
    const day = utcDay(-29 + index).toISOString().slice(0, 10);
    return { day, views: byDay.get(day) ?? 0 };
  });

  const sources = new Map<string, number>();
  for (const row of sourceRows) {
    const host = row.source.replace(/^www\./, "");
    if (host !== "direct" && isInternalHost(host)) continue;
    const label = host === "direct" ? "direct" : host;
    sources.set(label, (sources.get(label) ?? 0) + num(row.views));
  }

  return {
    today: { views: num(t?.today_views), ips: num(t?.today_ips) },
    week: {
      views: weekViews,
      ips: num(t?.week_ips),
      signups: num(p?.signups_week),
      scans: scans,
      qrCreated,
      delta: prevViews > 0 ? (weekViews - prevViews) / prevViews : null,
    },
    month: { views: num(t?.month_views), ips: num(t?.month_ips), signups: num(p?.signups_month) },
    accounts: {
      total: num(p?.total),
      pro: num(p?.pro),
      free: num(p?.free),
      disabled: num(p?.disabled),
    },
    money: {
      mrrCents: num(m?.mrr),
      active: num(m?.active),
      trialing: num(m?.trialing),
      pastDue: num(m?.past_due),
      canceling: num(m?.canceling),
    },
    daily,
    topPages: pageRows.map((row) => ({ path: row.path, views: num(row.views), ips: num(row.ips) })),
    sources: [...sources.entries()]
      .map(([label, views]) => ({ label, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6),
    countries: countryRows.map((row) => ({ code: row.code, views: num(row.views) })),
    devices: deviceRows.map((row) => ({ device: row.device, views: num(row.views) })),
    pastDue: pastDueRows.map((row) => row.user),
    atLimit: atLimitRows,
    atLimitCount: num(atLimitCountRows[0]?.total),
  };
});

export type AccountListFilters = {
  q?: string;
  plan?: Plan;
  state?: "active" | "disabled";
  page: number;
};

export const listAccounts = cache(async (filters: AccountListFilters) => {
  const where: Prisma.UserWhereInput = {};
  const q = filters.q?.trim();
  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }
  if (filters.plan) where.plan = filters.plan;
  if (filters.state === "disabled") where.disabledAt = { not: null };
  if (filters.state === "active") where.disabledAt = null;

  const total = await prisma.user.count({ where });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const rows = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      role: true,
      disabledAt: true,
      createdAt: true,
      subscription: { select: { status: true, priceCents: true } },
      _count: { select: { qrCodes: true } },
      pageViews: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true, ip: true, city: true },
      },
    },
  });
  return { rows, total, page, pages };
});

export const getAccount = cache(async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      disabledAt: true,
      createdAt: true,
      updatedAt: true,
      subscription: true,
      _count: { select: { qrCodes: true, pageViews: true } },
      qrCodes: {
        orderBy: { updatedAt: "desc" },
        take: 12,
        select: { id: true, name: true, dynamic: true, scans: true, destination: true },
      },
      pageViews: {
        orderBy: { createdAt: "desc" },
        take: 12,
        select: {
          id: true,
          path: true,
          ip: true,
          city: true,
          country: true,
          device: true,
          createdAt: true,
          bot: true,
        },
      },
    },
  });
  if (!user) return null;

  const ips = await prisma.$queryRaw<Array<{ ip: string; views: number; last: Date }>>`
    SELECT ip, count(*)::int AS views, max("createdAt") AS last
    FROM "PageView"
    WHERE "userId" = ${id}
    GROUP BY ip
    ORDER BY last DESC
    LIMIT 8
  `;
  return { user, ips };
});

export type SubscriptionListFilters = {
  q?: string;
  status?: SubscriptionStatus;
  page: number;
};

export const listSubscriptions = cache(async (filters: SubscriptionListFilters) => {
  const where: Prisma.SubscriptionWhereInput = {};
  if (filters.status) where.status = filters.status;
  const q = filters.q?.trim();
  if (q) {
    where.user = {
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    };
  }

  const total = await prisma.subscription.count({ where });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const rows = await prisma.subscription.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      user: { select: { id: true, name: true, email: true, plan: true, disabledAt: true } },
    },
  });
  return { rows, total, page, pages };
});

export type VisitListFilters = {
  q?: string;
  ip?: string;
  range: 1 | 7 | 30;
  bots: boolean;
  page: number;
};

export const listVisits = cache(async (filters: VisitListFilters) => {
  const start = utcDay(-(filters.range - 1));
  const q = filters.q?.trim();
  const ip = filters.ip?.trim();
  const where: Prisma.PageViewWhereInput = { createdAt: { gte: start } };
  if (!filters.bots) where.bot = false;
  if (ip) where.ip = ip;
  if (q) {
    where.OR = [
      { path: { contains: q, mode: "insensitive" } },
      { ip: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { user: { is: { email: { contains: q, mode: "insensitive" } } } },
    ];
  }

  const [total, ipGroups, dossier] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView.groupBy({ by: ["ip"], where }),
    ip ? loadIpDossier(ip) : Promise.resolve(null),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const rows = await prisma.pageView.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      path: true,
      ip: true,
      city: true,
      country: true,
      device: true,
      bot: true,
      createdAt: true,
      referrer: true,
      userAgent: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return { rows, total, ips: ipGroups.length, page, pages, dossier };
});

async function loadIpDossier(ip: string) {
  const [span, accounts] = await Promise.all([
    prisma.pageView.aggregate({
      where: { ip },
      _min: { createdAt: true },
      _max: { createdAt: true },
      _count: { _all: true },
    }),
    prisma.pageView.findMany({
      where: { ip, userId: { not: null } },
      distinct: ["userId"],
      select: { user: { select: { id: true, name: true, email: true } } },
      take: 12,
    }),
  ]);
  return {
    ip,
    first: span._min.createdAt,
    last: span._max.createdAt,
    views: span._count._all,
    accounts: accounts.flatMap((row) => (row.user ? [row.user] : [])),
  };
}
