"use client";

import { useActionState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { updateAccount, type AccountActionState } from "@/lib/admin-actions";
import { eurosToInput } from "@/lib/format";

const fieldClass =
  "h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-md outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-fixed";

type Props = {
  userId: string;
  role: "USER" | "ADMIN";
  disabled: boolean;
  plan: "FREE" | "PRO";
  status: "NONE" | "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  priceCents: number;
  periodEnd: string;
  cancelAtPeriodEnd: boolean;
  notes: string;
  savedKey: string;
};

export function AccountForm(props: Props) {
  const t = useT();
  const [state, action, pending] = useActionState(updateAccount, null as AccountActionState);

  return (
    <form action={action} key={props.savedKey} className="flex flex-col gap-5 border border-outline-variant bg-surface-container-lowest p-5">
      <input type="hidden" name="userId" value={props.userId} />
      <div>
        <h2 className="font-display text-headline-md">{t("admin.account.access")}</h2>
        <p className="mt-1 text-body-sm text-on-surface-variant">{t("admin.account.accessHint")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.account.role")}</span>
          <select name="role" defaultValue={props.role} className={fieldClass}>
            <option value="USER">{t("admin.account.roleUser")}</option>
            <option value="ADMIN">{t("admin.account.roleAdmin")}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.account.plan")}</span>
          <select name="plan" defaultValue={props.plan} className={fieldClass}>
            <option value="FREE">{t("admin.plan.FREE")}</option>
            <option value="PRO">{t("admin.plan.PRO")}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.account.subStatus")}</span>
          <select name="status" defaultValue={props.status} className={fieldClass}>
            {(["NONE", "TRIALING", "ACTIVE", "PAST_DUE", "CANCELED"] as const).map((status) => (
              <option key={status} value={status}>
                {t(`admin.status.${status}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.account.price")}</span>
          <input
            name="priceEuros"
            inputMode="decimal"
            defaultValue={eurosToInput(props.priceCents)}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.account.periodEnd")}</span>
          <input name="periodEnd" type="date" defaultValue={props.periodEnd} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm text-on-surface-variant">{t("admin.account.password")}</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={t("admin.account.passwordPh")}
            className={fieldClass}
          />
        </label>
      </div>
      <label className="flex items-start gap-2 text-body-sm">
        <input type="checkbox" name="cancelAtPeriodEnd" value="1" defaultChecked={props.cancelAtPeriodEnd} className="mt-0.5" />
        <span>{t("admin.account.cancelAtEnd")}</span>
      </label>
      <label className="flex items-start gap-2 text-body-sm">
        <input type="checkbox" name="disabled" value="1" defaultChecked={props.disabled} className="mt-0.5" />
        <span>
          {t("admin.account.disable")}
          <span className="mt-0.5 block text-on-surface-variant">{t("admin.account.disableHint")}</span>
        </span>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-sm text-on-surface-variant">{t("admin.account.notes")}</span>
        <textarea
          name="notes"
          defaultValue={props.notes}
          maxLength={500}
          rows={3}
          placeholder={t("admin.account.notesPh")}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-fixed"
        />
      </label>
      <p className="text-body-sm text-on-surface-variant">{t("admin.account.planHint")}</p>
      {state?.ok === false ? (
        <p role="alert" className="bg-error-container px-3 py-2 text-body-sm text-on-error-container">
          {t(state.error)}
        </p>
      ) : null}
      {state?.ok ? (
        <p role="status" className="bg-primary-fixed px-3 py-2 text-body-sm text-on-primary-fixed">
          {t("admin.account.saved")}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center self-start rounded-lg bg-tertiary-container px-4 text-label-md text-on-tertiary hover:bg-tertiary disabled:opacity-50"
      >
        {pending ? t("admin.account.saving") : t("admin.account.save")}
      </button>
    </form>
  );
}
