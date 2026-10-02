"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { t } from "@/lib/strings.uz";

// Server action'ga yuboriladigan switch (forma ichida).
export function SwitchSubmit({ on, label }: { on: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" role="switch" aria-checked={on} aria-label={label} className="sw" disabled={pending}>
      <i />
    </button>
  );
}

export function DeleteAccount({ action }: { action: (fd: FormData) => Promise<void> }) {
  const ref = useRef<HTMLDialogElement>(null);
  const s = t.app.settings;
  return (
    <>
      <button type="button" className="btn danger" onClick={() => ref.current?.showModal()}>
        {s.delete}
      </button>
      <dialog ref={ref} className="dlg" aria-labelledby="del-title">
        <h2 id="del-title">{s.delete}</h2>
        <p>{s.deleteText}</p>
        <div className="dlg-a">
          <button type="button" className="btn ghost" onClick={() => ref.current?.close()}>
            {s.cancel}
          </button>
          <form action={action}>
            <input type="hidden" name="confirm" value="yes" />
            <button type="submit" className="btn red">
              {s.deleteConfirm}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
