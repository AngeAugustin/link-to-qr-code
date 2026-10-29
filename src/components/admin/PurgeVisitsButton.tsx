"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useT } from "@/components/i18n/LocaleProvider";
import { purgeOldVisits, type PurgeState } from "@/lib/admin-actions";

export function PurgeVisitsButton() {
  const t = useT();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(purgeOldVisits, null as PurgeState);

  return (
    <form ref={formRef} action={action} className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-label-sm text-on-surface-variant underline-offset-2 hover:text-on-surface hover:underline"
      >
        {t("admin.visits.purge")}
      </button>
      {state?.ok ? (
        <p role="status" className="text-body-sm text-on-surface-variant">
          {state.deleted > 0 ? t("admin.visits.purged", { count: state.deleted }) : t("admin.visits.purgeNone")}
        </p>
      ) : null}
      {state?.ok === false ? (
        <p role="alert" className="text-body-sm text-error">
          {t(state.error)}
        </p>
      ) : null}
      <ConfirmModal
        open={open}
        title={t("admin.visits.purgeTitle")}
        description={t("admin.visits.purgeConfirm")}
        confirmLabel={t("admin.visits.purge")}
        tone="danger"
        confirming={pending}
        onCancel={() => {
          if (!pending) setOpen(false);
        }}
        onConfirm={() => {
          setOpen(false);
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
