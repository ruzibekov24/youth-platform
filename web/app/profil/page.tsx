import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getProfileData } from "@/lib/queries";
import { INTERESTS, t } from "@/lib/strings.uz";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.profile.title} · ${t.brand}` };

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-card border border-line p-4">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-sm text-muted">{label}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const user = await requireUser();
  const p = t.profile;
  const data = await getProfileData(user.id);
  const empty =
    !data.clubs.length && !data.attendance.length && !data.ideas.length && !data.joined.length;
  const interestLabels = user.interests.map(
    (k) => INTERESTS.find((i) => i.key === k)?.label ?? k,
  );

  return (
    <main className="flex-1 py-10">
      <Container className="max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{user.first_name}</h1>
            <p className="mt-1 text-sm text-muted">
              {user.age_range} · {user.region}
            </p>
          </div>
          <ButtonLink href="/sozlamalar" variant="secondary">
            {p.settings}
          </ButtonLink>
        </div>
        {interestLabels.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {interestLabels.map((l) => (
              <Badge key={l}>{l}</Badge>
            ))}
          </div>
        )}
        <p className="mt-6 text-sm text-muted">{p.sub}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={data.clubs.length} label={p.statsClubs} />
          <Stat value={data.attendance.length} label={p.statsAttended} />
          <Stat value={data.ideas.length} label={p.statsIdeas} />
          <Stat value={data.joined.length + data.teammates} label={p.statsTeam} />
        </div>

        {empty ? (
          <div className="mt-8">
            <EmptyState
              title={p.emptyTitle}
              text={p.emptyText}
              action={<ButtonLink href="/klublar">{t.today.browseClubs}</ButtonLink>}
            />
          </div>
        ) : (
          <>
            {data.clubs.length > 0 && (
              <Section title={p.clubsTitle}>
                <ul className="space-y-2">
                  {data.clubs.map((c) => (
                    <li key={c.clubs.slug}>
                      <Card className="flex items-center justify-between gap-3 p-4">
                        <Link href={`/klublar/${c.clubs.slug}`} className="font-medium">
                          {c.clubs.name}
                        </Link>
                        <span className="text-sm text-muted">{formatDate(c.joined_at)}</span>
                      </Card>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {data.attendance.length > 0 && (
              <Section title={p.attendedTitle}>
                <ul className="space-y-2">
                  {data.attendance.map((a, i) => (
                    <li key={i}>
                      <Card className="flex items-center justify-between gap-3 p-4">
                        <span>
                          <span className="font-medium">{a.club_sessions.topic}</span>
                          <span className="block text-sm text-muted">
                            {a.club_sessions.clubs.name}
                          </span>
                        </span>
                        <span className="text-sm text-muted">{formatDate(a.checked_in_at)}</span>
                      </Card>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {data.ideas.length > 0 && (
              <Section title={p.ideasTitle}>
                <ul className="space-y-2">
                  {data.ideas.map((i) => (
                    <li key={i.id}>
                      <Card className="flex items-center justify-between gap-3 p-4">
                        <Link href={`/miya/${i.id}`} className="font-medium">
                          {i.title}
                        </Link>
                        <Badge tone={i.status === "open" ? "ok" : "neutral"}>
                          {p.ideaStatus[i.status]}
                        </Badge>
                      </Card>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {data.joined.length > 0 && (
              <Section title={p.teamsTitle}>
                <ul className="space-y-2">
                  {data.joined.map((j) => (
                    <li key={j.ideas.id}>
                      <Card className="p-4">
                        <Link href={`/miya/${j.ideas.id}`} className="font-medium">
                          {j.ideas.title}
                        </Link>
                        <p className="text-sm text-muted">{p.joinedAs(j.role)}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </>
        )}
      </Container>
    </main>
  );
}
