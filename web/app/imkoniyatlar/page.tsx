import type { Metadata } from "next";
import { OpportunityCard } from "@/components/opportunity-card";
import { ButtonLink } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { listActiveOpportunities } from "@/lib/opportunities";
import { matchesFilters, OPP_TYPES, sortOpportunities, type OppFilters } from "@/lib/opp-filter";
import { t } from "@/lib/strings.uz";
import { AGE_RANGES, isAgeRange } from "@/lib/validate";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.opp.title} · ${t.brand}` };

type Params = { tur?: string; yosh?: string; hudud?: string };

function href(current: Params, patch: Partial<Params>) {
  const next = { ...current, ...patch };
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `/imkoniyatlar?${s}` : "/imkoniyatlar";
}

export default async function OpportunitiesPage({ searchParams }: PageProps<"/imkoniyatlar">) {
  const raw = await searchParams;
  const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const current: Params = { tur: one(raw.tur), yosh: one(raw.yosh), hudud: one(raw.hudud) };

  const all = await listActiveOpportunities();
  const regions = [...new Set(all.map((o) => o.region))].sort();

  const filters: OppFilters = {
    type: OPP_TYPES.find((x) => x === current.tur),
    age: isAgeRange(current.yosh) ? current.yosh : undefined,
    region: regions.find((r) => r === current.hudud),
  };
  const items = sortOpportunities(all.filter((o) => matchesFilters(o, filters)));
  const filtered = Boolean(filters.type || filters.age || filters.region);

  const row = (label: string, chips: React.ReactNode) => (
    <div>
      <p className="mb-2 text-sm font-medium text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">{chips}</div>
    </div>
  );

  return (
    <main className="flex-1 py-10">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">{t.opp.title}</h1>
        <p className="mt-1 max-w-xl text-muted">{t.opp.lead}</p>

        <div className="mt-8 space-y-4">
          {row(
            t.opp.filterType,
            <>
              <FilterChip href={href(current, { tur: undefined })} active={!filters.type}>
                {t.opp.all}
              </FilterChip>
              {OPP_TYPES.map((x) => (
                <FilterChip key={x} href={href(current, { tur: x })} active={filters.type === x}>
                  {t.opp.types[x]}
                </FilterChip>
              ))}
            </>,
          )}
          {row(
            t.opp.filterAge,
            <>
              <FilterChip href={href(current, { yosh: undefined })} active={!filters.age}>
                {t.opp.all}
              </FilterChip>
              {AGE_RANGES.map((a) => (
                <FilterChip key={a} href={href(current, { yosh: a })} active={filters.age === a}>
                  {a}
                </FilterChip>
              ))}
            </>,
          )}
          {regions.length > 1 &&
            row(
              t.opp.filterRegion,
              <>
                <FilterChip href={href(current, { hudud: undefined })} active={!filters.region}>
                  {t.opp.all}
                </FilterChip>
                {regions.map((r) => (
                  <FilterChip key={r} href={href(current, { hudud: r })} active={filters.region === r}>
                    {r}
                  </FilterChip>
                ))}
              </>,
            )}
        </div>

        <div className="mt-8">
          {items.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((o) => (
                <OpportunityCard key={o.id} opp={o} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={filtered ? t.opp.empty : t.opp.emptyAll}
              action={
                filtered ? (
                  <ButtonLink href="/imkoniyatlar" variant="secondary">
                    {t.opp.reset}
                  </ButtonLink>
                ) : undefined
              }
            />
          )}
        </div>
      </Container>
    </main>
  );
}
