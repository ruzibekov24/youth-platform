import "server-only";
import { db } from "./db";
import type { Idea, Opportunity } from "./types";

export type UpcomingSession = {
  id: string;
  starts_at: string;
  place_or_link: string;
  topic: string;
  club: { name: string; slug: string };
};

// "Bugun" sahifasi: kelayotgan sessiyalar, saqlangan imkoniyatlar, yangi gʻoyalar.
export async function getTodayData(userId: string, ageGroup: "under18" | "adult") {
  const now = new Date().toISOString();

  const memberships = await db().from("club_members").select("club_id").eq("user_id", userId);
  if (memberships.error) throw memberships.error;
  const clubIds = (memberships.data ?? []).map((m) => m.club_id as string);

  const [sessions, saved, ideas] = await Promise.all([
    clubIds.length
      ? db()
          .from("club_sessions")
          .select("id, starts_at, place_or_link, topic, clubs(name, slug)")
          .in("club_id", clubIds)
          .gte("starts_at", now)
          .order("starts_at")
          .limit(3)
      : Promise.resolve({ data: [], error: null }),
    db().from("saved_opportunities").select("opportunities(*)").eq("user_id", userId),
    db()
      .from("ideas")
      .select("id, title, problem, needed_roles, status, age_group, created_at")
      .eq("status", "open")
      .eq("age_group", ageGroup)
      .neq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);
  if (sessions.error) throw sessions.error;
  if (saved.error) throw saved.error;
  if (ideas.error) throw ideas.error;

  type Raw = { id: string; starts_at: string; place_or_link: string; topic: string; clubs: UpcomingSession["club"] };
  const upcoming: UpcomingSession[] = ((sessions.data ?? []) as unknown as Raw[]).map((s) => ({
    id: s.id,
    starts_at: s.starts_at,
    place_or_link: s.place_or_link,
    topic: s.topic,
    club: s.clubs,
  }));

  const savedOpps = ((saved.data ?? []) as unknown as { opportunities: Opportunity | null }[])
    .map((r) => r.opportunities)
    .filter((o): o is Opportunity => o !== null && o.status === "active")
    .sort((a, b) => {
      // Muddati yaqinlari oldinda, muddatsizlar oxirida.
      const ta = a.closes_at ? new Date(a.closes_at).getTime() : Infinity;
      const tb = b.closes_at ? new Date(b.closes_at).getTime() : Infinity;
      return ta - tb;
    });

  return { upcoming, savedOpps, ideas: (ideas.data ?? []) as Idea[] };
}

// Profil alohida jadval emas: haqiqiy harakatlardan avtomatik yigʻiladi.
export async function getProfileData(userId: string) {
  const [clubs, attendance, ideas, joined, owned] = await Promise.all([
    db().from("club_members").select("joined_at, clubs(name, slug)").eq("user_id", userId).order("joined_at", { ascending: false }),
    db()
      .from("club_attendance")
      .select("checked_in_at, club_sessions(topic, clubs(name))")
      .eq("user_id", userId)
      .order("checked_in_at", { ascending: false }),
    db().from("ideas").select("id, title, status, created_at").eq("owner_id", userId).order("created_at", { ascending: false }),
    db()
      .from("join_requests")
      .select("created_at, role, ideas(id, title)")
      .eq("user_id", userId)
      .eq("status", "accepted")
      .order("created_at", { ascending: false }),
    db().from("ideas").select("id").eq("owner_id", userId),
  ]);
  for (const r of [clubs, attendance, ideas, joined, owned]) if (r.error) throw r.error;

  const ownedIds = (owned.data ?? []).map((i) => i.id as string);
  let teammates = 0;
  if (ownedIds.length) {
    const acc = await db()
      .from("join_requests")
      .select("id", { count: "exact", head: true })
      .in("idea_id", ownedIds)
      .eq("status", "accepted");
    if (acc.error) throw acc.error;
    teammates = acc.count ?? 0;
  }

  return {
    clubs: (clubs.data ?? []) as unknown as { joined_at: string; clubs: { name: string; slug: string } }[],
    attendance: (attendance.data ?? []) as unknown as {
      checked_in_at: string;
      club_sessions: { topic: string; clubs: { name: string } };
    }[],
    ideas: (ideas.data ?? []) as { id: string; title: string; status: Idea["status"]; created_at: string }[],
    joined: (joined.data ?? []) as unknown as {
      created_at: string;
      role: string;
      ideas: { id: string; title: string };
    }[],
    teammates,
  };
}
