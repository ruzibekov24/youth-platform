import type { Metadata } from "next";
import { BackLink, PageHead, Section } from "@/components/app/blocks";
import { DeleteAccount, Switch } from "@/components/app/settings-controls";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.settings.title} · ${t.brand}` };

export default function SettingsPage() {
  const s = t.app.settings;
  return (
    <>
      <BackLink href="/profil" />
      <PageHead title={s.title} />

      <Section title={s.reminders}>
        <div className="pnl set">
          <div className="set-row">
            <div>
              <b>{s.remindSession}</b>
              <div className="sub">{s.remindSessionText}</div>
            </div>
            <Switch label={s.remindSession} defaultOn />
          </div>
          <div className="set-row">
            <div>
              <b>{s.remindDeadline}</b>
              <div className="sub">{s.remindDeadlineText}</div>
            </div>
            <Switch label={s.remindDeadline} defaultOn />
          </div>
        </div>
      </Section>

      <Section title={s.theme}>
        <div className="pnl set">
          <div className="set-row">
            <div>
              <b>{s.themeRow}</b>
              <div className="sub">{s.themeText}</div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </Section>

      <Section title={s.telegram}>
        <div className="pnl set">
          <div className="set-row">
            <div>
              <b>{s.telegramNone}</b>
              <div className="sub">{s.telegramText}</div>
            </div>
          </div>
        </div>
      </Section>

      <Section title={s.data}>
        <div className="pnl">
          <ul className="list-dots">
            {s.dataItems.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p>{s.dataNever}</p>
        </div>
      </Section>

      <Section title={s.delete}>
        <div className="pnl set">
          <div className="set-row">
            <div className="sub" style={{ marginTop: 0 }}>
              {s.deleteText}
            </div>
            <DeleteAccount />
          </div>
        </div>
      </Section>
    </>
  );
}
