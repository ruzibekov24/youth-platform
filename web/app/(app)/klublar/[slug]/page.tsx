import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { reportEntity } from "@/app/actions/report";
import { BackLink, Section } from "@/components/app/blocks";
import { ReportButton } from "@/components/app/forms";
import { clubTile, Sample, SessionLine } from "@/components/app/items";
import { CheckIcon, PinIcon, QrIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { getCurrentUser } from "@/lib/auth";
import { getClubBySlug, getClubPage } from "@/lib/clubs";
import { ageAllowed, cycleState, neededToStart, seatsLeft, weekOf } from "@/lib/cycle";
import { formatDay } from "@/lib/format";
import { t } from "@/lib/strings.uz";
import { joinClub, leaveClub } from "../actions";

export async function generateMetadata(props: PageProps<"/klublar/[slug]">): Promise<Metadata> {
  const club = await getClubBySlug((await props.params).slug);
  return { title: club ? `${club.name} · ${t.brand}` : t.brand };
}

export default async function ClubPage(props: PageProps<"/klublar/[slug]">) {
  const { slug } = await props.params;
  const user = await getCurrentUser();
  const page = await getClubPage(slug, user?.id ?? null);
  if (!page) notFound();
  const { club, sessions, isMember, members, progress } = page;
  const [next, ...later] = sessions;
  const c = t.app.clubs;
  const cy = t.club.cycle;
  const left = seatsLeft(club.seats, members);
  const state = cycleState(club, members);
  const ageOk = ageAllowed(club.age_group, user?.age_range ?? null);
  const week = club.starts_on && club.cycle_weeks ? weekOf(club.starts_on, club.cycle_weeks) : 0;

  return (
    <>
      <BackLink href="/klublar" />
      <div className="detail">
        <div className="stack">
          <div className="pnl">
            <div className="club-top">
              <Tile name={clubTile(club)} size={76} className="tile-lg" />
              <div>
                <Sample on={club.is_sample} />
                <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginTop: 8 }}>{club.name}</h1>
              </div>
            </div>
            <p>{club.description}</p>
          </div>
          <div className="pnl">
            <dl className="dl">
              <div>
                <dt>{c.schedule}</dt>
                <dd>{club.schedule_text}</dd>
              </div>
              <div>
                <dt>{c.organizer}</dt>
                <dd>{club.organizer}</dd>
              </div>
              {club.age_group && (
                <div>
                  <dt>{cy.audience}</dt>
                  <dd>{cy.ageOnly[club.age_group]}</dd>
                </div>
              )}
              {club.cycle_weeks && (
                <div>
                  <dt>{cy.length}</dt>
                  <dd>{cy.weeks(club.cycle_weeks)}</dd>
                </div>
              )}
              {club.starts_on && (
                <div>
                  <dt>{cy.starts}</dt>
                  <dd>{formatDay(`${club.starts_on}T00:00:00+05:00`)}</dd>
                </div>
              )}
              {club.seats && (
                <div>
                  <dt>{cy.seats}</dt>
                  <dd>
                    {cy.seatsOf(members, club.seats)}
                    <div className="seat-meter" aria-hidden>
                      <i style={{ width: `${Math.min(100, Math.round((members / club.seats) * 100))}%` }} />
                    </div>
                  </dd>
                </div>
              )}
            </dl>
            {state === "needs" && <p className="cycle-note">{cy.needs(neededToStart(club.min_to_start, members))}</p>}
            {state === "ready" && <p className="cycle-note">{cy.ready}</p>}
            {state === "running" && club.cycle_weeks && (
              <p className="cycle-note">
                {week > club.cycle_weeks ? cy.finished : cy.running(week, club.cycle_weeks)}
              </p>
            )}
          </div>
          {later.length > 0 && (
            <Section title={t.club.sessions}>
              <div className="pnl stack">
                {later.map((s) => (
                  <SessionLine key={s.id} s={s} />
                ))}
              </div>
            </Section>
          )}
          <Section title={t.club.rules.title}>
            <div className="pnl">
              <ul className="rules">
                {t.club.rules.items.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </Section>
        </div>

        <aside>
          <div className="pnl stack">
            <span className="eyebrow">{c.next}</span>
            {next ? (
              <>
                <h3>{next.topic}</h3>
                <SessionLine s={{ starts_at: next.starts_at, topic: "", kind: next.kind }} />
                {next.kind === "demo" && <p className="cycle-note">{t.club.demoHint}</p>}
                <div className="meta">
                  <span>
                    <PinIcon /> {next.place_or_link}
                  </span>
                </div>
              </>
            ) : (
              <p style={{ margin: 0 }}>{t.club.noSessions}</p>
            )}
            {!user ? (
              <Link href={`/kirish?next=/klublar/${slug}`} className="btn w">
                {c.join}
              </Link>
            ) : isMember ? (
              <>
                <div className="ok-note meta">
                  <span>
                    <CheckIcon /> {t.club.member}
                  </span>
                </div>
                {progress && progress.held > 0 && (
                  <p className="cycle-note" style={{ margin: 0 }}>
                    {cy.yourProgress(progress.attended, progress.held)}
                  </p>
                )}
                <form action={leaveClub.bind(null, club.id, slug)}>
                  <button type="submit" className="btn ghost w">
                    {t.club.leave}
                  </button>
                </form>
              </>
            ) : !ageOk ? (
              <p className="ok-note">{cy.ageBlocked}</p>
            ) : left === 0 ? (
              <p className="ok-note">{cy.full}</p>
            ) : (
              <form action={joinClub.bind(null, club.id, slug)}>
                <button type="submit" className="btn w">
                  {c.join}
                </button>
              </form>
            )}
            <div className="meta qr-note">
              <QrIcon />
              <span>{c.qrNote}</span>
            </div>
          </div>
          <ReportButton action={reportEntity.bind(null, "club", club.id)} />
        </aside>
      </div>
    </>
  );
}
