"use client";

import { useRef, useState } from "react";
import { t } from "@/lib/strings.uz";

// Eslatma sozlamasi. Hozircha faqat brauzerda (NAMUNA); M6/M7 da bazaga yoziladi.
export function Switch({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="sw" onClick={() => setOn(!on)}>
      <i />
    </button>
  );
}

export function DeleteAccount() {
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
        <p className="muted">{s.deleteLater}</p>
        <form method="dialog" className="dlg-a">
          <button className="btn ghost" value="cancel">
            {s.cancel}
          </button>
          <button className="btn red" value="confirm" disabled>
            {s.deleteConfirm}
          </button>
        </form>
      </dialog>
    </>
  );
}
