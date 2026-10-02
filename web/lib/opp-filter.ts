import { isClosed } from "./format.ts";
import type { AgeRange, Opportunity, OpportunityType } from "./types.ts";

export const OPP_TYPES: OpportunityType[] = ["scholarship", "program", "competition", "internship", "event"];

export type OppFilters = { type?: OpportunityType; age?: AgeRange; region?: string };

const AGE_BOUNDS: Record<AgeRange, [number, number]> = {
  "13-15": [13, 15],
  "16-17": [16, 17],
  "18-25": [18, 25],
};

export function matchesFilters(o: Opportunity, f: OppFilters): boolean {
  if (f.type && o.type !== f.type) return false;
  if (f.region && o.region !== f.region) return false;
  if (f.age) {
    const [lo, hi] = AGE_BOUNDS[f.age];
    if ((o.age_min ?? 0) > hi || (o.age_max ?? 99) < lo) return false;
  }
  return true;
}

// Ochiqlar muddati yaqinidan boshlab (muddatsizlar oxirida), yopilganlar eng oxirida.
export function sortOpportunities(list: Opportunity[], now = new Date()): Opportunity[] {
  const key = (o: Opportunity) => (o.closes_at ? new Date(o.closes_at).getTime() : Infinity);
  return [...list].sort((a, b) => {
    const ca = isClosed(a.closes_at, now);
    const cb = isClosed(b.closes_at, now);
    if (ca !== cb) return ca ? 1 : -1;
    return ca ? key(b) - key(a) : key(a) - key(b);
  });
}
