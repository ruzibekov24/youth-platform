import "server-only";
import { db } from "./db";
import type { Opportunity } from "./types";

export async function listActiveOpportunities(): Promise<Opportunity[]> {
  const r = await db().from("opportunities").select("*").eq("status", "active");
  if (r.error) throw r.error;
  return r.data as Opportunity[];
}

export async function getOpportunityPage(id: string, userId: string | null) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await db().from("opportunities").select("*").eq("id", id).eq("status", "active").maybeSingle();
  if (r.error) throw r.error;
  if (!r.data) return null;
  let saved = false;
  if (userId) {
    const s = await db()
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("user_id", userId)
      .eq("opportunity_id", id)
      .maybeSingle();
    if (s.error) throw s.error;
    saved = Boolean(s.data);
  }
  return { opp: r.data as Opportunity, saved };
}
