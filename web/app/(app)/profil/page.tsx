import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/app/blocks";
import { BulbIcon, CheckIcon, ClubIcon, GearIcon, LockIcon, UsersIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { requireUser } from "@/lib/auth";
import { formatDay } from "@/lib/format";
import { getProfileData } from "@/lib/queries";
import { INTERESTS, t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.profile.title} · ${t.brand}` };

type Entry = { key: string; icon: typeof CheckIcon; title: string; detail: string; date: string; href?: string };

// Profil alohida jadval emas: qatnashish, a'zolik, g'oya va qabul qilingan so'rovlardan yig'iladi.
export default async function ProfilePage() {
  const user = await requireUser();
  const c = t.app.profile;
  const d = await getProfileData(user.id);

  const entries: Entry[] = [
    ...d.attendance.map((a, i) => ({
      key: `a${i}`,
      icon: CheckIcon,
      title: a.club_sessions.clubs.name,
      detail: `${c.attended} · ${a.club_sessions.topic}`,
      date: a.checked_in_at,
    })),
    ...d.clubs.map((m) => ({
      key: `c${m.clubs.slug}`,
      icon: ClubIcon,
      title: m.clubs.name,
      detail: c.joinedClub,
      date: m.joined_at,
      href: `/klublar/${m.clubs.slug}`,
    })),
    ...d.ideas.map((i) => ({
      key: `i${i.id}`,
      icon: BulbIcon,
      title: i.title,
      detail: `${c.ideaPosted} · ${c.ideaStatus[i.status]}`,
      date: i.created_at,
      href: `/miya/${i.id}`,
    })),
    ...d.joined.map((j) => ({
      key: `j${j.ideas.id}`,
      icon: UsersIcon,
      title: j.ideas.title,
      detail: `${c.joinedTeam} · ${j.role}`,
      date: j.created_at,
      href: `/miya/${j.ideas.id}`,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const interests = user.interests.map((k) => INTERESTS.find((i) => i.key === k)?.label ?? k);

  return (
    <>
      <div className="ph">
        <div className="prof">
          <span className="avatar" aria-hidden>
            {(user.first_name ?? "?")[0]}
          </span>
          <div>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)" }}>{user.first_name}</h1>
            <div className="meta" style={{ marginTop: 6 }}>
              {user.age_range && <span>{user.age_range}</span>}
              {user.region && <span>{user.region}</span>}
            </div>
          </div>
        </div>
        <Link href="/sozlamalar" className="btn ghost">
          <GearIcon /> {c.settings}
        </Link>
      </div>

      <h2 style={{ fontSize: 22 }}>{c.title}</h2>
      <div className="stats">
        <div className="stat">
          <b>{d.attendance.length}</b>
          <span>{c.sessions}</span>
        </div>
        <div className="stat">
          <b>{d.clubs.length}</b>
          <span>{c.clubs}</span>
        </div>
        <div className="stat">
          <b>{d.joined.length + d.teammates}</b>
          <span>{c.teams}</span>
        </div>
      </div>

      <Section title={c.timeline}>
        {entries.length ? (
          <div className="pnl">
            <ol className="tline">
              {entries.map((e) => {
                const Icon = e.icon;
                const body = (
                  <>
                    <b>{e.title}</b>
                    <span className="sub">{e.detail}</span>
                  </>
                );
                return (
                  <li key={e.key}>
                    <span className="ico">
                      <Icon />
                    </span>
                    {e.href ? (
                      <Link href={e.href} className="tl-link">
                        {body}
                      </Link>
                    ) : (
                      <div>{body}</div>
                    )}
                    <time dateTime={e.date}>{formatDay(e.date)}</time>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div className="pnl empty">
            <Tile name="medal" size={64} className="tile-sm" />
            <h2>{c.empty}</h2>
            <p>{c.emptyText}</p>
          </div>
        )}
        <p className="meta" style={{ marginTop: 12 }}>
          <span>{c.timelineNote}</span>
        </p>
      </Section>

      {interests.length > 0 && (
        <Section title={c.interests}>
          <div className="chips">
            {interests.map((i) => (
              <span key={i} className="ch">
                {i}
              </span>
            ))}
          </div>
        </Section>
      )}
      <p className="meta" style={{ marginTop: 20 }}>
        <span>
          <LockIcon /> {c.private}
        </span>
      </p>
    </>
  );
}
