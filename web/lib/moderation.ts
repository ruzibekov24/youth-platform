import "server-only";
import { db } from "./db";

// Bot orqali moderatsiya (admin panel yo'q). Moderatorlar: ADMIN_TELEGRAM_IDS (vergul bilan).
export function adminIds(): number[] {
  return (process.env.ADMIN_TELEGRAM_IDS ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isSafeInteger(n) && n > 0);
}

export const isAdmin = (telegramId: number) => adminIds().includes(telegramId);

export type PendingIdea = {
  id: string;
  title: string;
  problem: string;
  description: string;
  needed_roles: string[];
  age_group: "under18" | "adult";
  author: string | null;
};

export async function getPendingIdea(id: string): Promise<PendingIdea | null> {
  const r = await db()
    .from("ideas")
    .select("id, title, problem, description, needed_roles, age_group, status, users(first_name)")
    .eq("id", id)
    .maybeSingle();
  if (r.error) throw r.error;
  const row = r.data as unknown as (PendingIdea & { status: string; users: { first_name: string | null } | null }) | null;
  if (!row || row.status !== "pending") return null;
  return { ...row, author: row.users?.first_name ?? null };
}

export async function listPendingIdeaIds(limit = 10): Promise<string[]> {
  const r = await db().from("ideas").select("id").eq("status", "pending").order("created_at").limit(limit);
  if (r.error) throw r.error;
  return (r.data ?? []).map((x) => x.id as string);
}

// Tasdiqlash yoki rad etish. Faqat hali "pending" bo'lsa o'zgaradi (ikki moderator bir vaqtda bossa ham bir marta).
export async function decideIdea(
  id: string,
  approve: boolean,
): Promise<{ title: string; ownerTelegramId: number } | null> {
  const patch = approve ? { status: "open", approved_notified_at: new Date().toISOString() } : { status: "closed" };
  const r = await db()
    .from("ideas")
    .update(patch)
    .eq("id", id)
    .eq("status", "pending")
    .select("title, users(telegram_id)");
  if (r.error) throw r.error;
  const row = (r.data?.[0] ?? null) as unknown as { title: string; users: { telegram_id: number } | null } | null;
  if (!row) return null;
  return { title: row.title, ownerTelegramId: row.users?.telegram_id ?? 0 };
}

export type OpenReport = {
  id: string;
  entity_type: "opportunity" | "club" | "idea";
  entity_id: string;
  reason: string;
  title: string;
  path: string;
};

const ENTITY = {
  opportunity: { table: "opportunities", title: "title", path: (id: string) => `/imkoniyatlar/${id}` },
  club: { table: "clubs", title: "name", path: (_id: string, slug?: string) => `/klublar/${slug ?? ""}` },
  idea: { table: "ideas", title: "title", path: (id: string) => `/miya/${id}` },
} as const;

export async function getOpenReport(id: string): Promise<OpenReport | null> {
  const r = await db()
    .from("reports")
    .select("id, entity_type, entity_id, reason, resolved_at")
    .eq("id", id)
    .maybeSingle();
  if (r.error) throw r.error;
  if (!r.data || r.data.resolved_at) return null;
  const rep = r.data as { id: string; entity_type: OpenReport["entity_type"]; entity_id: string; reason: string };
  const e = ENTITY[rep.entity_type];
  const cols = rep.entity_type === "club" ? "name, slug" : "title";
  const ent = await db().from(e.table).select(cols).eq("id", rep.entity_id).maybeSingle();
  if (ent.error) throw ent.error;
  const row = (ent.data ?? {}) as Record<string, string>;
  return { ...rep, title: row[e.title] ?? "—", path: e.path(rep.entity_id, row.slug) };
}

export async function listOpenReportIds(limit = 10): Promise<string[]> {
  const r = await db().from("reports").select("id").is("resolved_at", null).order("created_at").limit(limit);
  if (r.error) throw r.error;
  return (r.data ?? []).map((x) => x.id as string);
}

// "hidden": obyekt saytdan olinadi (imkoniyat yashiriladi, klub nofaol, g'oya yopiladi). "dismissed": o'zgarishsiz.
export async function resolveReport(id: string, resolution: "hidden" | "dismissed"): Promise<OpenReport | null> {
  const rep = await getOpenReport(id);
  if (!rep) return null;
  if (resolution === "hidden") {
    const q =
      rep.entity_type === "opportunity"
        ? db().from("opportunities").update({ status: "hidden" })
        : rep.entity_type === "club"
          ? db().from("clubs").update({ is_active: false })
          : db().from("ideas").update({ status: "closed" });
    const h = await q.eq("id", rep.entity_id);
    if (h.error) throw h.error;
  }
  const u = await db()
    .from("reports")
    .update({ resolved_at: new Date().toISOString(), resolution })
    .eq("id", id)
    .is("resolved_at", null);
  if (u.error) throw u.error;
  return rep;
}
