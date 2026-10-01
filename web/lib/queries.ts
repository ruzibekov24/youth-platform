import "server-only";
import { db, dbConfigured } from "./db";
import { sampleClubs, sampleOpportunities } from "./sample-data";
import type { Club, Opportunity } from "./types";

// Baza sozlanmagan lokal muhitda landing namunaviy kartalar bilan ochiladi (NAMUNA belgisi bilan).
export async function getHomeCards(): Promise<{ clubs: Club[]; opportunities: Opportunity[] }> {
  if (!dbConfigured()) return { clubs: sampleClubs, opportunities: sampleOpportunities };

  const [clubs, opps] = await Promise.all([
    db().from("clubs").select("*").eq("is_active", true).order("name").limit(2),
    db()
      .from("opportunities")
      .select("*")
      .eq("status", "active")
      .or(`closes_at.is.null,closes_at.gt.${new Date().toISOString()}`)
      .order("closes_at", { ascending: true, nullsFirst: false })
      .limit(2),
  ]);
  if (clubs.error) throw clubs.error;
  if (opps.error) throw opps.error;
  return { clubs: clubs.data as Club[], opportunities: opps.data as Opportunity[] };
}
