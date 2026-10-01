import "server-only";
import { sendTelegram } from "./bot";
import { db } from "./db";
import { daysLeft, formatDateTime } from "./format";
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

const CLOSING_DAYS = 3;

// Saqlangan imkoniyat yopilishiga 3 kun qolganda eslatma (bir marta).
export async function sendClosingReminders(now = new Date()): Promise<number> {
  const limit = new Date(now.getTime() + CLOSING_DAYS * 86_400_000).toISOString();
  const r = await db()
    .from("saved_opportunities")
    .select("user_id, opportunity_id, opportunities!inner(title, closes_at, status), users(telegram_id, reminders_enabled, onboarding_step)")
    .is("reminder_sent_at", null)
    .eq("opportunities.status", "active")
    .gte("opportunities.closes_at", now.toISOString())
    .lte("opportunities.closes_at", limit);
  if (r.error) throw r.error;

  let sent = 0;
  for (const row of (r.data ?? []) as unknown as {
    user_id: string;
    opportunity_id: string;
    opportunities: { title: string; closes_at: string };
    users: Member["users"];
  }[]) {
    const u = row.users;
    if (u && u.reminders_enabled && !u.onboarding_step) {
      const days = Math.max(1, daysLeft(row.opportunities.closes_at, now));
      if (await safeSend(u.telegram_id, t.reminders.closing(row.opportunities.title, days))) sent++;
    }
    const mark = await db()
      .from("saved_opportunities")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("user_id", row.user_id)
      .eq("opportunity_id", row.opportunity_id);
    if (mark.error) throw mark.error;
  }
  return sent;
}

// Moderator gʻoyani "open" qilgach (Supabase Studio), egasiga bir marta xabar beriladi.
export async function sendIdeaApprovals(): Promise<number> {
  const r = await db()
    .from("ideas")
    .select("id, title, users(telegram_id)")
    .eq("status", "open")
    .is("approved_notified_at", null);
  if (r.error) throw r.error;

  let sent = 0;
  for (const i of (r.data ?? []) as unknown as { id: string; title: string; users: { telegram_id: number } | null }[]) {
    if (i.users && (await safeSendPlain(i.users.telegram_id, t.bot.ideaApproved(i.title)))) sent++;
    const mark = await db().from("ideas").update({ approved_notified_at: new Date().toISOString() }).eq("id", i.id);
    if (mark.error) throw mark.error;
  }
  return sent;
}

async function safeSendPlain(telegramId: number, text: string): Promise<boolean> {
  try {
    await sendTelegram(telegramId, text);
    return true;
  } catch {
    return false;
  }
}
