import "server-only";
import { db } from "./db";
import type { AgeRange } from "./types";

export type OnboardingStep = "name" | "age" | "region" | "interests";

export type UserRow = {
  id: string;
  first_name: string | null;
  age_range: AgeRange | null;
  region: string | null;
  interests: string[];
  onboarding_step: OnboardingStep | null;
  reminders_enabled: boolean;
};

const COLUMNS =
  "id, first_name, age_range, region, interests, onboarding_step, reminders_enabled";

export async function findOrCreateByTelegramId(telegramId: number): Promise<UserRow> {
  const found = await db().from("users").select(COLUMNS).eq("telegram_id", telegramId).maybeSingle();
  if (found.error) throw found.error;
  if (found.data) return found.data as UserRow;

  const created = await db()
    .from("users")
    .insert({ telegram_id: telegramId, onboarding_step: "name" })
    .select(COLUMNS)
    .single();
  if (created.error) throw created.error;
  return created.data as UserRow;
}

export async function getUserByTelegramId(telegramId: number): Promise<UserRow | null> {
  const r = await db().from("users").select(COLUMNS).eq("telegram_id", telegramId).maybeSingle();
  if (r.error) throw r.error;
  return (r.data as UserRow | null) ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const r = await db().from("users").select(COLUMNS).eq("id", id).maybeSingle();
  if (r.error) throw r.error;
  return (r.data as UserRow | null) ?? null;
}

export async function updateUser(id: string, patch: Partial<UserRow>): Promise<void> {
  const r = await db().from("users").update(patch).eq("id", id);
  if (r.error) throw r.error;
}

// Haqiqiy oʻchirish: bogʻliq qatorlar (klub aʼzoligi, qatnashish, gʻoya, soʻrov) cascade bilan ketadi,
// events.user_id null boʻladi (anonim).
export async function deleteUser(id: string): Promise<void> {
  const r = await db().from("users").delete().eq("id", id);
  if (r.error) throw r.error;
}
