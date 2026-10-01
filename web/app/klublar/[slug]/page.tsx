import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportButton } from "@/components/report-button";
import { Badge, SampleBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth";
import { getClubBySlug, getClubPage } from "@/lib/clubs";
import { formatDateTime } from "@/lib/format";
import { t } from "@/lib/strings.uz";
import { joinClub, leaveClub } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/klublar/[slug]">): Promise<Metadata> {
  const club = await getClubBySlug((await params).slug);
  return { title: `${club?.name ?? t.club.title} · ${t.brand}` };
}

export default async function ClubPage({ params }: PageProps<"/klublar/[slug]">) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const page = await getClubPage(slug, user?.id ?? null);
  if (!page) notFound();
  const { club, sessions, isMember } = page;
  const c = t.club;

  return (
    <main className="flex-1 py-10">
      <Container className="max-w-3xl">
        <div className="flex items-center gap-2">
          <Badge tone="accent">{t.nav.clubs}</Badge>
          {club.is_sample && <SampleBadge />}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{club.name}</h1>
        <p className="mt-3 text-lg text-muted">{club.description}</p>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">{c.organizer}</dt>
            <dd className="font-medium">{club.organizer}</dd>
          </div>
          <div>
            <dt className="text-muted">{c.schedule}</dt>
            <dd className="font-medium">{club.schedule_text}</dd>
          </div>
        </dl>

        <div className="mt-8">
          {!user ? (
            <ButtonLink href={`/kirish?next=/klublar/${club.slug}`}>{c.loginToJoin}</ButtonLink>
          ) : isMember ? (
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="ok">{c.member}</Badge>
              <form action={leaveClub.bind(null, club.id, club.slug)}>
                <Button type="submit" variant="ghost">
                  {c.leave}
                </Button>
              </form>
            </div>
          ) : (
            <form action={joinClub.bind(null, club.id, club.slug)}>
              <Button type="submit">{c.join}</Button>
            </form>
          )}
        </div>

        <h2 className="mt-12 text-xl font-semibold tracking-tight">{c.sessions}</h2>
        {sessions.length ? (
          <ul className="mt-4 space-y-3">
            {sessions.map((s) => (
              <li key={s.id}>
                <Card className="p-4">
                  <p className="font-semibold">{s.topic}</p>
                  <p className="mt-1 text-sm">{formatDateTime(s.starts_at)}</p>
                  <p className="text-sm text-muted">{s.place_or_link}</p>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">{c.noSessions}</p>
        )}

        <div className="mt-12 border-t border-line pt-4">
          <ReportButton entityType="club" entityId={club.id} />
        </div>
      </Container>
    </main>
  );
}
