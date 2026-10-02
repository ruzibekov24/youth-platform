import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon, ChevronRightIcon } from "@/components/icons";
import { Tile, type TileName } from "@/components/ui/tile";
import { requireUser } from "@/lib/auth";
import { daysLeft, formatDay, formatTime, isClosed, isSameTashkentDay, nextSevenDays, tashkentDayKey as dayKey } from "@/lib/format";
import { groupOfUser } from "@/lib/ideas";
import { getHomeData } from "@/lib/queries";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.home.hello} · ${t.brand}` };

// Asosiy ekran: matn kam, ko'proq vizual. Kirgandan keyingi birinchi sahifa.
export default async function HomePage() {
  const user = await requireUser();
  const h = t.app.home;
  const d = await getHomeData(user.id, groupOfUser(user));
  const next = d.upcoming[0];
  const deadlines = d.savedOpps.filter((o) => o.closes_at && !isClosed(o.closes_at));

  // 7 kunlik chiziq: sessiya (ko'k nuqta) va saqlangan imkoniyat muddati (qora nuqta).
  const sessionDays = new Set(d.upcoming.map((s) => dayKey(new Date(s.starts_at))));
  const deadlineDays = new Set(deadlines.map((o) => dayKey(new Date(o.closes_at!))));
  const week = nextSevenDays().map((w) => ({
    ...w,
    label: h.weekDays[w.weekday],
    session: sessionDays.has(w.key),
    deadline: deadlineDays.has(w.key),
  }));

  const nextWhen = next
    ? isSameTashkentDay(next.starts_at)
      ? `${h.today} · ${formatTime(next.starts_at)}`
      : `${formatDay(next.starts_at)} · ${formatTime(next.starts_at)}`
    : null;

  const tiles: { href: string; tile: TileName; title: string; sub: string }[] = [
    { href: "/klublar", tile: "mic", title: t.app.clubs.title, sub: h.tiles.clubs(d.counts.clubs) },
    { href: "/imkoniyatlar", tile: "cap", title: t.app.opps.title, sub: h.tiles.opps(d.counts.opportunities) },
    { href: "/miya", tile: "bulb", title: t.app.miya.title, sub: h.tiles.miya(d.counts.ideas) },
    { href: "/profil", tile: "medal", title: t.app.tabs[4].label, sub: h.tiles.profile(d.stats.sessions) },
  ];

  return (
    <div className="home">
      <section className="home-hero">
        <h1>
          {h.hello}, {user.first_name}
        </h1>
        <div className="home-stats">
          <div>
            <b>{d.stats.sessions}</b>
            <span>{h.stats.sessions}</span>
          </div>
          <div>
            <b>{d.stats.saved}</b>
            <span>{h.stats.saved}</span>
          </div>
          <div>
            <b>{d.stats.teams}</b>
            <span>{h.stats.teams}</span>
          </div>
        </div>
      </section>

      <Link href={next ? `/klublar/${next.club.slug}` : "/klublar"} className="next-card">
        <Tile name={next ? "mic" : "calendar"} size={72} className="tile-lg" />
        <div>
          <span className="eyebrow">{h.nextStep}</span>
          <h2>{next ? next.club.name : h.noClub}</h2>
          <span className="next-when">{next ? nextWhen : h.noClubSub}</span>
        </div>
        <span className="next-go" aria-hidden>
          <ChevronRightIcon />
        </span>
      </Link>

      <section className="pnl week" aria-label={h.week}>
        <div className="week-days">
          {week.map((w, i) => (
            <div key={w.key} className={`wd ${i === 0 ? "is-today" : ""}`}>
              <span>{w.label}</span>
              <b>{w.num}</b>
              <i>
                {w.session && <em className="dot-s" />}
                {w.deadline && <em className="dot-d" />}
              </i>
            </div>
          ))}
        </div>
        <div className="week-legend">
          <span>
            <em className="dot-s" /> {h.legendSession}
          </span>
          <span>
            <em className="dot-d" /> {h.legendDeadline}
          </span>
        </div>
      </section>

      <section className="space-grid" aria-label={h.spaces}>
        {tiles.map((s) => (
          <Link key={s.href} href={s.href} className="space-tile">
            <Tile name={s.tile} size={64} className="tile-sm" />
            <b>{s.title}</b>
            <span>{s.sub}</span>
          </Link>
        ))}
      </section>

      {deadlines.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <h2>{h.deadlines}</h2>
          </div>
          <div className="dl-strip">
            {deadlines.slice(0, 6).map((o) => {
              const left = daysLeft(o.closes_at!);
              return (
                <Link key={o.id} href={`/imkoniyatlar/${o.id}`} className="dl-card">
                  <span className="dl-num">
                    <b>{Math.max(left, 0)}</b> {left <= 1 ? h.lastDay : h.daysShort}
                  </span>
                  <span className="dl-title">{o.title}</span>
                  <span className="ch on">{t.opp.types[o.type]}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {d.ideas.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <h2>{h.ideas}</h2>
            <Link href="/miya" className="more">
              {t.app.today.all} <ChevronRightIcon />
            </Link>
          </div>
          <div className="grid2">
            {d.ideas.slice(0, 2).map((i) => (
              <Link key={i.id} href={`/miya/${i.id}`} className="pnl pnl-link idea-mini">
                <Tile name="bulb" size={44} className="tile-sm tile-xs" />
                <div>
                  <b>{i.title}</b>
                  <span>{i.needed_roles.join(" · ")}</span>
                </div>
                <ArrowUpRightIcon />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
