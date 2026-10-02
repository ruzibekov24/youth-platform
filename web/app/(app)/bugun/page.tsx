import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SampleNotice, Section } from "@/components/app/blocks";
import { IdeaItem, OpportunityItem, SessionLine } from "@/components/app/items";
import { PinIcon, QrIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { requireUser } from "@/lib/auth";
import { isClosed, isSameTashkentDay } from "@/lib/format";
import { groupOfUser } from "@/lib/ideas";
import { getTodayData } from "@/lib/queries";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.today.hello} · ${t.brand}` };

export default async function TodayPage() {
  const user = await requireUser();
  const c = t.app.today;
  const { upcoming, savedOpps, ideas } = await getTodayData(user.id, groupOfUser(user));
  const next = upcoming[0];
  const saved = savedOpps.filter((o) => !isClosed(o.closes_at));

  return (
    <>
      <PageHead title={`${c.hello}, ${user.first_name ?? ""}`} lead={c.lead} />
      <SampleNotice show={saved.some((o) => o.is_sample)} />

      {next ? (
        <div className="pnl hero-card">
          <Tile name="mic" size={64} className="tile-sm" />
          <div>
            <span className="eyebrow">
              {c.next}
              {isSameTashkentDay(next.starts_at) && ` · ${c.today}`}
            </span>
            <h2>{next.club.name}</h2>
            <div style={{ marginTop: 8 }} className="stack">
              <SessionLine s={next} />
              <div className="meta">
                <span>
                  <PinIcon /> {next.place_or_link}
                </span>
              </div>
            </div>
          </div>
          <Link href={`/klublar/${next.club.slug}`} className="btn">
            <QrIcon /> {c.checkin}
          </Link>
        </div>
      ) : (
        <div className="pnl hero-card">
          <Tile name="calendar" size={64} className="tile-sm" />
          <div>
            <h2>{c.noClub}</h2>
            <p>{c.noClubText}</p>
          </div>
          <Link href="/klublar" className="btn">
            {c.toClubs}
          </Link>
        </div>
      )}

      <Section title={c.deadlines} href="/imkoniyatlar">
        {saved.length ? (
          <div className="rows">
            {saved.slice(0, 4).map((o) => (
              <OpportunityItem key={o.id} o={o} />
            ))}
          </div>
        ) : (
          <p className="notice">{c.deadlinesEmpty}</p>
        )}
      </Section>

      <Section title={c.ideas} href="/miya">
        {ideas.length ? (
          <div className="grid2">
            {ideas.slice(0, 2).map((i) => (
              <IdeaItem key={i.id} idea={i} />
            ))}
          </div>
        ) : (
          <p className="notice">{c.ideasEmpty}</p>
        )}
      </Section>
    </>
  );
}
