import "server-only";
import { cache } from "react";
import { db } from "./db";
import type { Club, ClubSession } from "./types";

export async function listClubs(): Promise<Club[]> {
  const r = await db().from("clubs").select("*").eq("is_active", true).order("name");
  if (r.error) throw r.error;
  return r.data as Club[];
}

export const getClubBySlug = cache(async (slug: string): Promise<Club | null> => {
  const r = await db().from("clubs").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (r.error) throw r.error;
  return (r.data as Club | null) ?? null;
});

export async function getClubPage(slug: string, userId: string | null) {
  const c = await getClubBySlug(slug);
  if (!c) return null;

  const [sessions, member] = await Promise.all([
    db()
      .from("club_sessions")
      .select("id, club_id, starts_at, place_or_link, topic")
      .eq("club_id", c.id)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(5),
    userId
      ? db().from("club_members").select("club_id").eq("club_id", c.id).eq("user_id", userId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (sessions.error) throw sessions.error;
  if (member.error) throw member.error;
  return { club: c, sessions: (sessions.data ?? []) as ClubSession[], isMember: Boolean(member.data) };
}

export async function getSessionByCode(code: string) {
  if (!/^[0-9a-f]{18}$/.test(code)) return null;
  const r = await db()
    .from("club_sessions")
    .select("id, club_id, starts_at, topic, clubs(name, slug)")
    .eq("checkin_code", code)
    .maybeSingle();
  if (r.error) throw r.error;
  return r.data as unknown as {
    id: string;
    club_id: string;
    starts_at: string;
    topic: string;
    clubs: { name: string; slug: string };
  } | null;
}
