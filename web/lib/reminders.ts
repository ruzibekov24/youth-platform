import "server-only";
import { sendTelegram } from "./bot";
import { db } from "./db";
import { formatDateTime } from "./format";
import { t } from "./strings.uz";
import { tashkentDayEnd } from "./time";

async function safeSend(telegramId: number, text: string): Promise<boolean> {
  try {
    await sendTelegram(telegramId, `${text}\n\n${t.reminders.stopHint}`);
    return true;
  } catch {
    // Foydalanuvchi botni bloklagan boʻlishi mumkin: boshqalarga xalaqit bermaymiz.
    return false;
  }
}

type Member = { users: { telegram_id: number; reminders_enabled: boolean; onboarding_step: string | null } | null };

// Klub sessiyasi kuni aʼzolarga eslatma (Toshkent kuni boʻyicha).
export async function sendSessionReminders(now = new Date()): Promise<number> {
  const sessions = await db()
    .from("club_sessions")
    .select("id, club_id, starts_at, topic, clubs(name)")
    .is("reminder_sent_at", null)
    .gte("starts_at", now.toISOString())
    .lt("starts_at", tashkentDayEnd(now).toISOString());
  if (sessions.error) throw sessions.error;

  let sent = 0;
  for (const s of (sessions.data ?? []) as unknown as {
    id: string;
    club_id: string;
    starts_at: string;
    topic: string;
    clubs: { name: string };
  }[]) {
    const members = await db()
      .from("club_members")
      .select("users(telegram_id, reminders_enabled, onboarding_step)")
      .eq("club_id", s.club_id);
    if (members.error) throw members.error;

    const text = t.reminders.session(s.clubs.name, s.topic, formatDateTime(s.starts_at));
    for (const m of (members.data ?? []) as unknown as Member[]) {
      const u = m.users;
      if (!u || !u.reminders_enabled || u.onboarding_step) continue;
      if (await safeSend(u.telegram_id, text)) sent++;
    }
    const mark = await db()
      .from("club_sessions")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", s.id);
    if (mark.error) throw mark.error;
  }
  return sent;
}
