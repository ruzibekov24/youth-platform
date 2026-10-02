import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink, ReportLink, SampleNotice, Section } from "@/components/app/blocks";
import { SessionLine } from "@/components/app/items";
import { QrIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { clubs, getClub } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

export function generateStaticParams() {
  return clubs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/klublar/[slug]">): Promise<Metadata> {
  const club = getClub((await props.params).slug);
  return { title: club ? `${club.name} · ${t.brand}` : t.brand };
}

export default async function ClubPage(props: PageProps<"/klublar/[slug]">) {
  const club = getClub((await props.params).slug);
  if (!club) notFound();
  const c = t.app.clubs;

  return (
    <>
      <BackLink href="/klublar" />
      <SampleNotice />
      <div className="detail">
        <div className="stack">
          <div className="pnl">
            <div className="club-top">
              <Tile name={club.tile} size={76} className="tile-lg" />
              <div>
                <span className="nm">{t.sample}</span>
                <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginTop: 8 }}>{club.name}</h1>
              </div>
            </div>
            <p>{club.description}</p>
          </div>
          <div className="pnl">
            <dl className="dl">
              <div>
                <dt>{c.schedule}</dt>
                <dd>{club.schedule}</dd>
              </div>
              <div>
                <dt>{c.place}</dt>
                <dd>
                  {club.place}, {club.region}
                </dd>
              </div>
              <div>
                <dt>{c.organizer}</dt>
                <dd>{club.organizer}</dd>
              </div>
            </dl>
          </div>
          <Section title={c.past}>
            {club.past.length ? (
              <div className="pnl stack">
                {club.past.map((s) => (
                  <SessionLine key={s.id} date={s.date} time={s.time} topic={s.topic} />
                ))}
              </div>
            ) : (
              <p className="notice">{c.pastEmpty}</p>
            )}
          </Section>
        </div>

        <aside>
          <div className="pnl stack">
            <span className="eyebrow">{c.next}</span>
            <h3>{club.next.topic}</h3>
            <SessionLine date={club.next.date} time={club.next.time} topic={club.next.place} />
            <Link href="/kirish" className="btn w">
              {c.join}
            </Link>
            <div className="meta qr-note">
              <QrIcon />
              <span>{c.qrNote}</span>
            </div>
          </div>
          <ReportLink />
        </aside>
      </div>
    </>
  );
}
