import { IdeaCard } from "@/components/idea-card";
import { OpportunityCard } from "@/components/opportunity-card";
import { Section } from "@/components/section";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { trackEvent } from "@/lib/events";
import { allow } from "@/lib/rate-limit";
import { formatDateTime } from "@/lib/format";
import { getTodayData } from "@/lib/queries";
import { t } from "@/lib/strings.uz";
import { ageGroupOf } from "@/lib/validate";
import type { UserRow } from "@/lib/users";

export async function Today({ user }: { user: UserRow }) {
  const g = t.today;
  const group = ageGroupOf(user.age_range!);
  // Qaytish oʻlchovi: foydalanuvchi kuniga bir marta "visit" deb yoziladi.
  if (await allow(`visit:${user.id}`, 86400, 1)) await trackEvent(user.id, "visit");
  const { upcoming, savedOpps, ideas } = await getTodayData(user.id, group);

  return (
    <main className="flex-1 py-10">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">{g.hello(user.first_name!)}</h1>
        <p className="mt-1 text-muted">{g.lead}</p>

        <Section title={g.nextSessions}>
          {upcoming.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {upcoming.map((s) => (
                <Card key={s.id}>
                  <p className="text-sm text-muted">{s.club.name}</p>
                  <p className="mt-1 text-lg font-semibold">{s.topic}</p>
                  <p className="mt-3 text-sm font-medium">{formatDateTime(s.starts_at)}</p>
                  <p className="text-sm text-muted">
                    {g.at}: {s.place_or_link}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title={g.nextSessionsEmpty}
              text={g.nextSessionsEmptyText}
              action={<ButtonLink href="/klublar">{g.browseClubs}</ButtonLink>}
            />
          )}
        </Section>

        <Section title={g.savedTitle}>
          {savedOpps.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedOpps.slice(0, 4).map((o) => (
                <OpportunityCard key={o.id} opp={o} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={g.savedEmpty}
              text={g.savedEmptyText}
              action={<ButtonLink href="/imkoniyatlar">{g.browseOpps}</ButtonLink>}
            />
          )}
        </Section>

        <Section title={g.ideasTitle}>
          {ideas.length ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {ideas.map((i) => (
                <IdeaCard key={i.id} idea={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={g.ideasEmpty}
              text={g.ideasEmptyText}
              action={<ButtonLink href="/miya">{g.browseIdeas}</ButtonLink>}
            />
          )}
        </Section>
      </Container>
    </main>
  );
}
