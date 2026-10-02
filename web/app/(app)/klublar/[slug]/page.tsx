import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { reportEntity } from "@/app/actions/report";
import { BackLink, SampleNotice, Section } from "@/components/app/blocks";
import { ReportButton } from "@/components/app/forms";
import { clubTile, Sample, SessionLine } from "@/components/app/items";
import { CheckIcon, PinIcon, QrIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { getCurrentUser } from "@/lib/auth";
import { getClubBySlug, getClubPage } from "@/lib/clubs";
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
  const { club, sessions, isMember } = page;
  const [next, ...later] = sessions;
  const c = t.app.clubs;

  return (
    <>
      <BackLink href="/klublar" />
      <SampleNotice show={club.is_sample} />
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
            </dl>
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
        </div>

        <aside>
          <div className="pnl stack">
            <span className="eyebrow">{c.next}</span>
            {next ? (
              <>
                <h3>{next.topic}</h3>
                <SessionLine s={{ starts_at: next.starts_at, topic: "" }} />
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
                <form action={leaveClub.bind(null, club.id, slug)}>
                  <button type="submit" className="btn ghost w">
                    {t.club.leave}
                  </button>
                </form>
              </>
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
