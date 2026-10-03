import "server-only";
import { cache } from "react";
import { db } from "./db";
import type { Club, ClubSession } from "./types";

const SESSION_COLS = "id, club_id, starts_at, place_or_link, topic, kind";

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

export type MemberProgress = { held: number; attended: number };

export async function getClubPage(slug: string, userId: string | null) {
  const c = await getClubBySlug(slug);
  if (!c) return null;

  const [sessions, past, members, member] = await Promise.all([
    db()
      .from("club_sessions")
      .select(SESSION_COLS)
      .eq("club_id", c.id)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(8),
    db().from("club_sessions").select("id").eq("club_id", c.id).lt("starts_at", new Date().toISOString()),
    db().from("club_members").select("user_id", { count: "exact", head: true }).eq("club_id", c.id),
    userId
      ? db().from("club_members").select("club_id").eq("club_id", c.id).eq("user_id", userId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (sessions.error) throw sessions.error;
  if (past.error) throw past.error;
  if (members.error) throw members.error;
  if (member.error) throw member.error;

  // Tsikl davomida a'zoning qatnashishi: o'tgan sessiyalardan nechtasiga kelgan.
  let progress: MemberProgress | null = null;
  if (userId && member.data) {
    const pastIds = (past.data ?? []).map((s) => s.id as string);
    let attended = 0;
    if (pastIds.length) {
      const a = await db().from("club_attendance").select("session_id").eq("user_id", userId).in("session_id", pastIds);
      if (a.error) throw a.error;
      attended = a.data?.length ?? 0;
    }
    progress = { held: pastIds.length, attended };
  }
  return {
    club: c,
    sessions: (sessions.data ?? []) as ClubSession[],
    isMember: Boolean(member.data),
    members: members.count ?? 0,
    progress,
  };
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

export type ClubOverview = { club: Club; next: ClubSession | null; members: number };

// Klublar ro'yxati: har biriga keyingi sessiya va a'zolar soni (MVP hajmida JS'da guruhlanadi).
export async function listClubsOverview(): Promise<ClubOverview[]> {
  const clubs = await listClubs();
  if (!clubs.length) return [];
  const ids = clubs.map((c) => c.id);
  const [sessions, members] = await Promise.all([
    db()
      .from("club_sessions")
      .select(SESSION_COLS)
      .in("club_id", ids)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at"),
    db().from("club_members").select("club_id").in("club_id", ids),
  ]);
  if (sessions.error) throw sessions.error;
  if (members.error) throw members.error;
  return clubs.map((club) => ({
    club,
    next: ((sessions.data ?? []) as ClubSession[]).find((s) => s.club_id === club.id) ?? null,
    members: (members.data ?? []).filter((m) => m.club_id === club.id).length,
  }));
}

export type JoinResult = "ok" | "already" | "full" | "missing";

// O'rinlar soni bazada atomik tekshiriladi (join_club, 0006).
export async function joinClubAtomic(clubId: string, userId: string): Promise<JoinResult> {
  const r = await db().rpc("join_club", { p_club: clubId, p_user: userId });
  if (r.error) throw r.error;
  return r.data as JoinResult;
}
