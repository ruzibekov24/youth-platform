import type { Metadata } from "next";
import { BackLink, PageHead } from "@/components/app/blocks";
import { ShieldIcon } from "@/components/icons";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.miya.form.title} · ${t.brand}` };

// Forma hozircha NAMUNA: yuborish M8 bosqichida server action bilan ulanadi.
export default function NewIdeaPage() {
  const f = t.app.miya.form;
  return (
    <>
      <BackLink href="/miya" />
      <PageHead title={f.title} lead={f.lead} />
      <form className="form pnl" aria-describedby="idea-later">
        <div className="field">
          <label htmlFor="i-name">{f.name}</label>
          <input id="i-name" name="title" type="text" maxLength={80} placeholder={f.namePh} required />
        </div>
        <div className="field">
          <label htmlFor="i-problem">{f.problem}</label>
          <input id="i-problem" name="problem" type="text" maxLength={160} placeholder={f.problemPh} required />
        </div>
        <div className="field">
          <label htmlFor="i-desc">{f.description}</label>
          <textarea id="i-desc" name="description" maxLength={800} placeholder={f.descriptionPh} />
        </div>
        <div className="field">
          <fieldset>
            <legend>{f.roles}</legend>
            <div className="pick">
              {f.roleOptions.map((r) => (
                <label key={r}>
                  <input type="checkbox" name="roles" value={r} />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="stack">
          <button type="submit" className="btn" disabled>
            {f.submit}
          </button>
          <p id="idea-later" className="meta qr-note" style={{ margin: 0 }}>
            <ShieldIcon />
            <span>
              {t.app.miya.moderation} {f.later}
            </span>
          </p>
        </div>
      </form>
    </>
  );
}
