import Link from "next/link";
import { CalendarIcon, PinIcon, UsersIcon } from "@/components/icons";
import { Tile, type TileName } from "@/components/ui/tile";
import type { ClubOverview } from "@/lib/clubs";
import { ageLabel, daysLeft, formatDay, formatTime, isClosed } from "@/lib/format";
import { t } from "@/lib/strings.uz";
import type { Club, ClubSession, Idea, Opportunity } from "@/lib/types";

// Ro'yxatlarda qayta ishlatiladigan elementlar. Namunaviy qatorlar NAMUNA belgisini ko'rsatadi.

export const Sample = ({ on }: { on: boolean }) => (on ? <span className="nm">{t.sample}</span> : null);

// Klubga 3D ikonka: bazada rasm yo'q, shuning uchun slug bo'yicha barqaror tanlanadi.
const CLUB_TILES: TileName[] = ["mic", "bulb", "cap", "team", "puzzle", "calendar"];
export function clubTile(club: Pick<Club, "slug">): TileName {
  let h = 0;
  for (const ch of club.slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CLUB_TILES[h % CLUB_TILES.length];
}

export function ClubItem({ item }: { item: ClubOverview }) {
  const { club, next, members } = item;
  const c = t.app.clubs;
  return (
    <Link href={`/klublar/${club.slug}`} className="pnl pnl-link">
      <div className="club-top">
        <Tile name={clubTile(club)} size={52} className="tile-sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-row">
            <h3>{club.name}</h3>
            <Sample on={club.is_sample} />
          </div>
          <div className="meta" style={{ marginTop: 4 }}>
            <span>{club.schedule_text}</span>
          </div>
        </div>
      </div>
      <div className="meta">
        <span>
          <UsersIcon /> {members} {c.members}
        </span>
        {next && (
          <span>
            <PinIcon /> {next.place_or_link}
          </span>
        )}
      </div>
      <div className="due" style={{ marginTop: 14 }}>
        <span>{c.next}</span>
        <b>{next ? `${formatDay(next.starts_at)} · ${formatTime(next.starts_at)}` : "—"}</b>
      </div>
    </Link>
  );
}

export function SessionLine({ s }: { s: Pick<ClubSession, "starts_at" | "topic"> }) {
  return (
    <div className="meta">
      <span>
        <CalendarIcon /> {formatDay(s.starts_at)} · {formatTime(s.starts_at)}
      </span>
      <span>{s.topic}</span>
    </div>
  );
}

export function DueLabel({ o }: { o: Opportunity }) {
  const c = t.app.opps;
  if (isClosed(o.closes_at)) return <span className="orow-r">{c.closed}</span>;
  if (!o.closes_at) return <span className="orow-r">{t.opp.noDeadline}</span>;
  const left = daysLeft(o.closes_at);
  return (
    <span className="orow-r">
      {c.deadline}
      <b>{left <= 1 ? t.app.today.lastDay : formatDay(o.closes_at)}</b>
    </span>
  );
}

export function OpportunityItem({ o }: { o: Opportunity }) {
  return (
    <Link href={`/imkoniyatlar/${o.id}`} className={`pnl pnl-link orow ${isClosed(o.closes_at) ? "is-closed" : ""}`}>
      <div>
        <h3>{o.title}</h3>
        <div className="sub">{o.organizer}</div>
        <div className="chips">
          <span className="ch on">{t.opp.types[o.type]}</span>
          <span className="ch">{ageLabel(o.age_min, o.age_max)}</span>
          <span className="ch">{o.region}</span>
          <Sample on={o.is_sample} />
        </div>
      </div>
      <DueLabel o={o} />
    </Link>
  );
}

export const groupLabel = (g: Idea["age_group"]) => (g === "adult" ? t.miya.groupAdult : t.miya.groupUnder18);

export function IdeaItem({ idea }: { idea: Idea }) {
  return (
    <Link href={`/miya/${idea.id}`} className="pnl pnl-link stack">
      <div className="t-row">
        <span className="ch">{groupLabel(idea.age_group)}</span>
      </div>
      <div>
        <h3>{idea.title}</h3>
        <p>{idea.problem}</p>
      </div>
      <div className="chips">
        {idea.needed_roles.map((r) => (
          <span key={r} className="ch">
            {r}
          </span>
        ))}
      </div>
    </Link>
  );
}
