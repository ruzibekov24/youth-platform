import type { Metadata } from "next";
import Link from "next/link";
import { SampleNotice, Section } from "@/components/app/blocks";
import { CheckIcon, ClubIcon, GearIcon, LockIcon, UsersIcon } from "@/components/icons";
import { formatDate, me, type Activity } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.profile.title} · ${t.brand}` };

const kindIcon: Record<Activity["kind"], typeof CheckIcon> = {
  attended: CheckIcon,
  joined_club: ClubIcon,
  idea: UsersIcon,
  team: UsersIcon,
};

export default function ProfilePage() {
  const c = t.app.profile;
  return (
    <>
      <div className="ph">
        <div className="prof">
          <span className="avatar" aria-hidden>
            {me.name[0]}
          </span>
          <div>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)" }}>{me.name}</h1>
            <div className="meta" style={{ marginTop: 6 }}>
              <span>{me.age_group}</span>
              <span>{me.region}</span>
            </div>
          </div>
        </div>
        <Link href="/sozlamalar" className="btn ghost">
          <GearIcon /> {c.settings}
        </Link>
      </div>
      <SampleNotice />

      <h2 style={{ fontSize: 22 }}>{c.title}</h2>
      <div className="stats">
        <div className="stat">
          <b>{me.stats.sessions}</b>
          <span>{c.sessions}</span>
        </div>
        <div className="stat">
          <b>{me.stats.clubs}</b>
          <span>{c.clubs}</span>
        </div>
        <div className="stat">
          <b>{me.stats.teams}</b>
          <span>{c.teams}</span>
        </div>
      </div>

      <Section title={c.timeline}>
        <div className="pnl">
          <ol className="tline">
            {me.activity.map((a) => {
              const Icon = kindIcon[a.kind];
              return (
                <li key={a.id}>
                  <span className="ico">
                    <Icon />
                  </span>
                  <div>
                    <b>{a.title}</b>
                    <span className="sub">{a.detail}</span>
                  </div>
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="meta" style={{ marginTop: 12 }}>
          <span>{c.timelineNote}</span>
        </p>
      </Section>

      <Section title={c.interests}>
        <div className="chips">
          {me.interests.map((i) => (
            <span key={i} className="ch">
              {i}
            </span>
          ))}
        </div>
        <p className="meta" style={{ marginTop: 16 }}>
          <span>
            <LockIcon /> {c.private}
          </span>
        </p>
      </Section>
    </>
  );
}
