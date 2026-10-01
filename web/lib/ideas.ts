import "server-only";
import { db } from "./db";
import type { Idea } from "./types";
import type { UserRow } from "./users";
import { ageGroupOf } from "./validate";

const IDEA_COLUMNS = "id, title, problem, needed_roles, status, age_group, created_at";

export type AgeGroup = "under18" | "adult";

export function groupOfUser(u: UserRow): AgeGroup {
  return ageGroupOf(u.age_range!);
}

// Kirganlar faqat oʻz yosh guruhi gʻoyalarini koʻradi; mehmonlar hammasini (aloqa baribir yopiq).
export async function listOpenIdeas(group: AgeGroup | null): Promise<Idea[]> {
  let q = db().from("ideas").select(IDEA_COLUMNS).eq("status", "open").order("created_at", { ascending: false });
  if (group) q = q.eq("age_group", group);
  const r = await q;
  if (r.error) throw r.error;
  return r.data as Idea[];
}

export type RequestRow = {
  id: string;
  user_id: string;
  role: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  first_name: string | null;
};

export async function getIdeaPage(id: string, viewer: UserRow | null) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await db()
    .from("ideas")
    .select(`${IDEA_COLUMNS}, description, owner_id, users(first_name)`)
    .eq("id", id)
    .maybeSingle();
  if (r.error) throw r.error;
  if (!r.data) return null;
  const row = r.data as unknown as Idea & { description: string; owner_id: string; users: { first_name: string | null } | null };
  const isOwner = viewer?.id === row.owner_id;
  // Tekshiruvdagi gʻoyani faqat egasi koʻradi.
  if (row.status === "pending" && !isOwner) return null;

  const sameGroup = viewer ? groupOfUser(viewer) === row.age_group : false;
  const idea: Idea = {
    id: row.id, title: row.title, problem: row.problem, needed_roles: row.needed_roles,
    status: row.status, age_group: row.age_group, created_at: row.created_at,
  };
  // Muallif ismi faqat shu yosh guruhidagi kirgan foydalanuvchiga koʻrinadi.
  const authorName = isOwner || sameGroup ? row.users?.first_name ?? null : null;
  // Egasi oʻz gʻoyasini yosh guruhidan qatʼiy nazar koʻradi.
  if (viewer && !isOwner && !sameGroup) return { idea, description: row.description, isOwner, sameGroup, authorName, myRequest: null, requests: [] as RequestRow[] };

  let myRequest: RequestRow | null = null;
  let requests: RequestRow[] = [];
  if (viewer) {
    const q = await db()
      .from("join_requests")
      .select("id, user_id, role, message, status, created_at, users(first_name)")
      .eq("idea_id", id)
      .order("created_at");
    if (q.error) throw q.error;
    const all = ((q.data ?? []) as unknown as (Omit<RequestRow, "first_name"> & { users: { first_name: string | null } | null })[]).map(
      (x) => ({ ...x, first_name: x.users?.first_name ?? null }),
    );
    if (isOwner) requests = all;
    else myRequest = all.find((x) => x.user_id === viewer.id) ?? null;
  }
  return { idea, description: row.description, isOwner, sameGroup, authorName, myRequest, requests };
}

// Gʻoya egasining Telegram ID'si faqat bot xabari uchun, serverda.
export async function getTelegramId(userId: string): Promise<number | null> {
  const r = await db().from("users").select("telegram_id").eq("id", userId).maybeSingle();
  if (r.error) throw r.error;
  return (r.data?.telegram_id as number | undefined) ?? null;
}
