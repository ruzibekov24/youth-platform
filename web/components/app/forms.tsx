"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { FlagIcon } from "@/components/icons";
import type { ReportState } from "@/app/actions/report";
import type { FormState } from "@/app/(app)/miya/actions";
import { t } from "@/lib/strings.uz";

function Submit({ children, className = "btn" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {children}
    </button>
  );
}

// Har bir ommaviy obyektda "Xabar berish": sabab yoziladi, reports jadvaliga tushadi.
export function ReportButton({
  action,
  label = t.app.report,
}: {
  action: (prev: ReportState, fd: FormData) => Promise<ReportState>;
  label?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState(action, "idle");
  const r = t.report;
  return (
    <>
      <button type="button" className="report" onClick={() => ref.current?.showModal()}>
        <FlagIcon /> {label}
      </button>
      <dialog ref={ref} className="dlg" aria-labelledby="rep-title">
        <h2 id="rep-title">{label}</h2>
        {state === "ok" ? (
          <>
            <p role="status">{r.thanks}</p>
            <div className="dlg-a">
              <button type="button" className="btn ghost" onClick={() => ref.current?.close()}>
                {t.common.back}
              </button>
            </div>
          </>
        ) : (
          <form action={formAction} className="form" style={{ marginTop: 14 }}>
            <div className="field">
              <label htmlFor="rep-reason">{r.reason}</label>
              <textarea id="rep-reason" name="reason" maxLength={500} required />
            </div>
            {state === "error" && (
              <p className="err" role="alert">
                {r.error}
              </p>
            )}
            <div className="dlg-a" style={{ marginTop: 0 }}>
              <button type="button" className="btn ghost" onClick={() => ref.current?.close()}>
                {t.common.cancel}
              </button>
              <Submit>{r.send}</Submit>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}

// MIYA: "Qo'shilaman" so'rovi (rol + qisqa xabar).
export function JoinForm({
  action,
  roles,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  roles: string[];
}) {
  const [state, formAction] = useActionState(action, { status: "idle" } as FormState);
  const j = t.miya.join;
  if (state.status === "ok") {
    return (
      <p className="ok-note" role="status">
        {j.sent}
      </p>
    );
  }
  return (
    <form action={formAction} className="form">
      <div className="field">
        <fieldset>
          <legend>{j.role}</legend>
          <div className="pick">
            {[...roles, t.common.other].map((r, i) => (
              <label key={r}>
                <input type="radio" name="role" value={r} required defaultChecked={i === 0} />
                {r}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="field">
        <label htmlFor="join-msg">{j.message}</label>
        <textarea id="join-msg" name="message" maxLength={500} required />
      </div>
      {state.status === "error" && (
        <p className="err" role="alert">
          {state.message}
        </p>
      )}
      <Submit className="btn w">{j.submit}</Submit>
    </form>
  );
}

// MIYA: yangi g'oya formasi. Yuborilgach moderatsiyaga tushadi (status = pending).
export function IdeaForm({
  action,
  roles,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  roles: readonly string[];
}) {
  const [state, formAction] = useActionState(action, { status: "idle" } as FormState);
  const f = t.miya.form;
  const a = t.app.miya.form;
  if (state.status === "ok") {
    return (
      <div className="pnl stack" role="status">
        <h2 style={{ fontSize: 22 }}>{f.sentTitle}</h2>
        <p>{f.sentText}</p>
        <div className="chips">
          <Link href="/miya" className="btn ghost">
            {t.app.miya.title}
          </Link>
          <Link href="/profil" className="btn ghost">
            {t.app.profile.title}
          </Link>
        </div>
      </div>
    );
  }
  return (
    <form action={formAction} className="form pnl">
      <div className="field">
        <label htmlFor="i-name">{a.name}</label>
        <input id="i-name" name="title" type="text" minLength={3} maxLength={80} placeholder={a.namePh} required />
      </div>
      <div className="field">
        <label htmlFor="i-problem">{a.problem}</label>
        <textarea id="i-problem" name="problem" minLength={10} maxLength={500} placeholder={a.problemPh} required />
      </div>
      <div className="field">
        <label htmlFor="i-desc">{a.description}</label>
        <textarea id="i-desc" name="description" minLength={10} maxLength={2000} placeholder={a.descriptionPh} required />
      </div>
      <div className="field">
        <fieldset>
          <legend>{a.roles}</legend>
          <div className="pick">
            {roles.map((r) => (
              <label key={r}>
                <input type="checkbox" name="roles" value={r} />
                {r}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      {state.status === "error" && (
        <p className="err" role="alert">
          {state.message}
        </p>
      )}
      <Submit>{a.submit}</Submit>
    </form>
  );
}
