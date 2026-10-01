"use client";

import { useActionState } from "react";
import { reportEntity, type ReportState } from "@/app/actions/report";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { t } from "@/lib/strings.uz";

export function ReportButton({
  entityType,
  entityId,
  label,
}: {
  label?: string;
  entityType: "opportunity" | "club" | "idea";
  entityId: string;
}) {
  const [state, action, pending] = useActionState<ReportState, FormData>(
    reportEntity.bind(null, entityType, entityId),
    "idle",
  );

  return (
    <details className="group text-sm">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-xl px-3 text-muted hover:bg-surface">
        {label ?? t.report.open}
      </summary>
      {state === "ok" ? (
        <p className="mt-2 text-ok" role="status">
          {t.report.thanks}
        </p>
      ) : (
        <form action={action} className="mt-2 max-w-md space-y-3">
          <label className="block">
            <span className="mb-1.5 block font-medium">{t.report.reason}</span>
            <Textarea name="reason" required maxLength={500} className="min-h-24" />
          </label>
          {state === "error" && (
            <p className="text-danger" role="alert">
              {t.report.error}
            </p>
          )}
          <Button type="submit" variant="secondary" disabled={pending}>
            {t.report.send}
          </Button>
        </form>
      )}
    </details>
  );
}
