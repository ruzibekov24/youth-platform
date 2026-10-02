import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SampleNotice, Section } from "@/components/app/blocks";
import { IdeaItem, OpportunityItem, SessionLine } from "@/components/app/items";
import { PinIcon, QrIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { clubs, getClub, getOpportunity, ideas, isClosed, me } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.today.hello} · ${t.brand}` };

export default function TodayPage() {
  const c = t.app.today;
  const club = getClub(me.clubs[0]) ?? clubs[0];
  const isToday = club.next.date === new Date().toISOString().slice(0, 10);
  const saved = me.saved
    .map(getOpportunity)
    .filter((o) => o && !isClosed(o))
    .sort((a, b) => a!.closes_at.localeCompare(b!.closes_at));

  return (
    <>
      <PageHead title={`${c.hello}, ${me.name}`} lead={c.lead} />
      <SampleNotice />

      <div className="pnl hero-card">
        <Tile name={club.tile} size={64} className="tile-sm" />
        <div>
          <span className="eyebrow">
            {c.next}
            {isToday && ` · ${c.today}`}
          </span>
          <h2>{club.name}</h2>
          <div style={{ marginTop: 8 }} className="stack">
            <SessionLine date={club.next.date} time={club.next.time} topic={club.next.topic} />
            <div className="meta">
              <span>
                <PinIcon /> {club.next.place}
              </span>
            </div>
          </div>
        </div>
        <Link href={`/klublar/${club.slug}`} className="btn">
          <QrIcon /> {c.checkin}
        </Link>
      </div>

      <Section title={c.deadlines} href="/imkoniyatlar">
        {saved.length ? (
          <div className="rows">
            {saved.map((o) => (
              <OpportunityItem key={o!.id} o={o!} />
            ))}
          </div>
        ) : (
          <p className="notice">{c.deadlinesEmpty}</p>
        )}
      </Section>

      <Section title={c.ideas} href="/miya">
        <div className="grid2">
          {ideas.slice(0, 2).map((i) => (
            <IdeaItem key={i.id} idea={i} />
          ))}
        </div>
      </Section>
    </>
  );
}
