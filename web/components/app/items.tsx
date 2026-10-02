import Link from "next/link";
import { CalendarIcon, PinIcon, UsersIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { daysLeft, formatDate, isClosed, type Club, type Idea, type Opportunity } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

// Ro'yxatlarda qayta ishlatiladigan elementlar. Hammasi NAMUNA belgisini ko'rsatadi.

const Sample = () => <span className="nm">{t.sample}</span>;

export function ClubItem({ club }: { club: Club }) {
  const c = t.app.clubs;
  return (
    <Link href={`/klublar/${club.slug}`} className="pnl pnl-link">
      <div className="club-top">
        <Tile name={club.tile} size={52} className="tile-sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-row">
            <h3>{club.name}</h3>
            <Sample />
          </div>
          <div className="meta" style={{ marginTop: 4 }}>
            <span>{club.schedule}</span>
          </div>
        </div>
      </div>
      <div className="meta">
        <span>
          <PinIcon /> {club.region}
        </span>
        <span>
          <UsersIcon /> {club.members} {c.members}
        </span>
      </div>
      <div className="due" style={{ marginTop: 14 }}>
        <span>{c.next}</span>
        <b>
          {formatDate(club.next.date)} · {club.next.time.split(" ")[0]}
        </b>
      </div>
    </Link>
  );
}

export function DueLabel({ o }: { o: Opportunity }) {
  const c = t.app.opps;
  if (isClosed(o)) return <span className="orow-r">{c.closed}</span>;
  const left = daysLeft(o.closes_at);
  return (
    <span className="orow-r">
      {c.deadline}
      <b>{left === 0 ? t.app.today.lastDay : formatDate(o.closes_at)}</b>
    </span>
  );
}

export function OpportunityItem({ o }: { o: Opportunity }) {
  const c = t.app.opps;
  return (
    <Link href={`/imkoniyatlar/${o.id}`} className={`pnl pnl-link orow ${isClosed(o) ? "is-closed" : ""}`}>
      <div>
        <h3>{o.title}</h3>
        <div className="sub">{o.organizer}</div>
        <div className="chips">
          <span className="ch on">{o.type}</span>
          <span className="ch">
            {o.age_min}–{o.age_max} {c.age}
          </span>
          <span className="ch">{o.region}</span>
          <Sample />
        </div>
      </div>
      <DueLabel o={o} />
    </Link>
  );
}

export function TeamBar({ idea }: { idea: Idea }) {
  const filled = idea.roles.filter((r) => r.filled).length;
  const pct = Math.round((filled / idea.roles.length) * 100);
  return (
    <div className="team-bar">
      <div className="bar" role="presentation">
        <u style={{ width: `${pct}%` }} />
      </div>
      <span>
        {t.app.miya.team}: {filled}/{idea.roles.length}
      </span>
    </div>
  );
}

export function IdeaItem({ idea }: { idea: Idea }) {
  return (
    <Link href={`/miya/${idea.id}`} className="pnl pnl-link stack">
      <div className="t-row">
        <span className="ch">{idea.age_group}</span>
        <Sample />
      </div>
      <div>
        <h3>{idea.title}</h3>
        <p>{idea.problem}</p>
      </div>
      <div className="chips">
        {idea.roles
          .filter((r) => !r.filled)
          .map((r) => (
            <span key={r.name} className="ch">
              {r.name}
            </span>
          ))}
      </div>
      <TeamBar idea={idea} />
    </Link>
  );
}

export function SessionLine({ date, time, topic }: { date: string; time: string; topic: string }) {
  return (
    <div className="meta">
      <span>
        <CalendarIcon /> {formatDate(date)} · {time}
      </span>
      <span>{topic}</span>
    </div>
  );
}
