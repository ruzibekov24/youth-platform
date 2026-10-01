import { ClubCard } from "@/components/club-card";
import { OpportunityCard } from "@/components/opportunity-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getHomeCards } from "@/lib/queries";
import { t } from "@/lib/strings.uz";

export async function Landing() {
  const l = t.landing;
  const { clubs, opportunities } = await getHomeCards();
  return (
    <main className="flex-1">
      <section className="pb-14 pt-14 sm:pb-20 sm:pt-24">
        <Container>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            {l.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{l.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/imkoniyatlar" className="sm:min-w-56">
              {l.ctaPrimary}
            </ButtonLink>
            <ButtonLink href="/kirish" variant="secondary">
              {l.ctaSecondary}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-12">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-3">
            {l.pillars.map((p) => (
              <li key={p.name}>
                <h2 className="text-base font-semibold">{p.name}</h2>
                <p className="mt-1 text-sm text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-surface py-14">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight">{l.soonTitle}</h2>
          <p className="mt-1 text-sm text-muted">{l.soonText}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {clubs.map((c) => (
              <ClubCard key={c.id} club={c} />
            ))}
            {opportunities.map((o) => (
              <OpportunityCard key={o.id} opp={o} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
