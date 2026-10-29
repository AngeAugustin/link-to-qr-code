"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { locales } from "@/lib/i18n/config";

const ROLES = ["USER", "ADMIN"] as const;
const PLANS = ["FREE", "PRO"] as const;
const STATUSES = ["NONE", "TRIALING", "ACTIVE", "PAST_DUE", "CANCELED"] as const;

type Role = (typeof ROLES)[number];
type Plan = (typeof PLANS)[number];
type Status = (typeof STATUSES)[number];

export type AccountActionState = { ok: true } | { ok: false; error: string } | null;
export type PurgeState = { ok: true; deleted: number } | { ok: false; error: string } | null;

function isOneOf<T extends string>(value: string, options: readonly T[]): value is T {
  return (options as readonly string[]).includes(value);
}

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

function refreshAdmin() {
  for (const locale of locales) revalidatePath(`/${locale}/admin`, "layout");
}

export async function updateAccount(_prev: AccountActionState, formData: FormData): Promise<AccountActionState> {
  const actor = await requireAdmin();
  if (!actor) return { ok: false, error: "admin.errors.forbidden" };

  const userId = String(formData.get("userId") ?? "");
  const roleRaw = String(formData.get("role") ?? "");
  const planRaw = String(formData.get("plan") ?? "");
  const statusRaw = String(formData.get("status") ?? "");
  if (!isOneOf(roleRaw, ROLES) || !isOneOf(planRaw, PLANS) || !isOneOf(statusRaw, STATUSES)) {
    return { ok: false, error: "admin.errors.invalid" };
  }

  let role: Role = roleRaw;
  let plan: Plan = planRaw;
  let status: Status = statusRaw;
  const disable = formData.get("disabled") === "1";
  const cancelAtPeriodEnd = formData.get("cancelAtPeriodEnd") === "1";
  const notesRaw = String(formData.get("notes") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const priceRaw = String(formData.get("priceEuros") ?? "").trim().replace(",", ".");
  const periodRaw = String(formData.get("periodEnd") ?? "").trim();

  if (notesRaw.length > 500) return { ok: false, error: "admin.errors.invalid" };
  if (password && (password.length < 8 || password.length > 200)) {
    return { ok: false, error: "admin.errors.password" };
  }

  const euros = priceRaw === "" ? 0 : Number(priceRaw);
  if (!Number.isFinite(euros) || euros < 0 || euros > 100_000) return { ok: false, error: "admin.errors.invalid" };
  let priceCents = Math.round(euros * 100);

  let currentPeriodEnd: Date | null = null;
  if (periodRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(periodRaw)) return { ok: false, error: "admin.errors.invalid" };
    currentPeriodEnd = new Date(`${periodRaw}T23:59:59.000Z`);
    if (Number.isNaN(currentPeriodEnd.getTime())) return { ok: false, error: "admin.errors.invalid" };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  if (!target) return { ok: false, error: "admin.errors.notFound" };

  if (actor.id === target.id && disable) return { ok: false, error: "admin.errors.selfDisable" };

  const removesAdmin = target.role === "ADMIN" && (role !== "ADMIN" || disable);
  if (removesAdmin) {
    const others = await prisma.user.count({
      where: { role: "ADMIN", disabledAt: null, id: { not: target.id } },
    });
    if (others === 0) return { ok: false, error: "admin.errors.lastAdmin" };
  }

  let cancelLater = cancelAtPeriodEnd;
  if (plan === "FREE") {
    if (status !== "NONE" && status !== "CANCELED") status = "CANCELED";
    priceCents = 0;
    cancelLater = false;
  } else if (status === "NONE" || status === "CANCELED") {
    status = "ACTIVE";
  }

  const passwordHash = password ? await hashPassword(password) : null;
  const periodStart =
    target.subscription?.currentPeriodStart ?? (status === "NONE" ? null : new Date());

  await prisma.$transaction([
    prisma.user.update({
      where: { id: target.id },
      data: {
        role,
        plan,
        disabledAt: disable ? (target.disabledAt ?? new Date()) : null,
        ...(passwordHash ? { passwordHash } : {}),
      },
    }),
    prisma.subscription.upsert({
      where: { userId: target.id },
      create: {
        userId: target.id,
        status,
        priceCents,
        currentPeriodStart: periodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: cancelLater,
        notes: notesRaw || null,
      },
      update: {
        status,
        priceCents,
        currentPeriodStart: periodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: cancelLater,
        notes: notesRaw || null,
      },
    }),
  ]);

  refreshAdmin();
  return { ok: true };
}

const RETENTION_DAYS = 90;

export async function purgeOldVisits(_prev: PurgeState, _formData: FormData): Promise<PurgeState> {
  const actor = await requireAdmin();
  if (!actor) return { ok: false, error: "admin.errors.forbidden" };

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
  const result = await prisma.pageView.deleteMany({ where: { createdAt: { lt: cutoff } } });
  refreshAdmin();
  return { ok: true, deleted: result.count };
}
