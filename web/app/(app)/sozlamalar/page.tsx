import type { Metadata } from "next";
import { BackLink, PageHead, Section } from "@/components/app/blocks";
import { DeleteAccount, SwitchSubmit } from "@/components/app/settings-controls";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { requireUser } from "@/lib/auth";
import { t } from "@/lib/strings.uz";
import { logout } from "../../kirish/actions";
import { deleteAccount, toggleReminders } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.app.settings.title} · ${t.brand}` };

export default async function SettingsPage() {
  const user = await requireUser();
  const s = t.app.settings;
  return (
    <>
      <BackLink href="/profil" />
      <PageHead title={s.title} />

      <Section title={s.reminders}>
        <form action={toggleReminders} className="pnl set">
          <div className="set-row">
            <div>
              <b>{s.remindAll}</b>
              <div className="sub">{s.remindAllText}</div>
            </div>
            <SwitchSubmit on={user.reminders_enabled} label={s.remindAll} />
          </div>
        </form>
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
              <b>{user.telegram_username ? `@${user.telegram_username}` : s.telegramNone}</b>
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
            <DeleteAccount action={deleteAccount} />
          </div>
        </div>
        <form action={logout} style={{ marginTop: 16 }}>
          <button type="submit" className="btn ghost">
            {s.logout}
          </button>
        </form>
      </Section>
    </>
  );
}
