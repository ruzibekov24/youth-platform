import { t } from "@/lib/strings.uz";
import {
  ArrowUpRightIcon,
  BookmarkIcon,
  CheckIcon,
  ClockIcon,
  MicIcon,
  PinIcon,
  TelegramMark,
  UsersIcon,
} from "@/components/icons";
import "./cards.css";

// Rang qoidasi: brend ko'ki faqat asosiy tugma va progressda; faol chip qora; sariq faqat NAMUNA.
// Kartalardagi tugmalar faqat ko'rinish uchun (landingdagi illyustratsiya), shuning uchun <span>.

export function Sample() {
  return <span className="nm">{t.sample}</span>;
}

function Bar({ value }: { value: number }) {
  return (
    <div className="bar" role="presentation">
      <u style={{ width: `${value}%` }} />
    </div>
  );
}

export function TodayCard() {
  const c = t.cards.today;
  const [club, opp] = c.rows;
  return (
    <div className="k">
      <div className="t mb">
        <h3>{c.title}</h3>
        <Sample />
      </div>
      <div className="r">
        <div className="row">
          <span className="ico">
            <MicIcon />
          </span>
          <div className="grow">
            <b>{club.title}</b>
            <div className="s">{club.sub}</div>
          </div>
        </div>
        <div className="row">
          <Bar value={club.progress} />
          <span className="s">{club.progress}%</span>
        </div>
      </div>
      <div className="r">
        <div className="row">
          <span className="ico">
            <BookmarkIcon />
          </span>
          <div className="grow">
            <b>{opp.title}</b>
            <div className="s">{opp.sub}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RemindersCard() {
  const c = t.cards.reminders;
  return (
    <div className="k">
      <h3>{c.title}</h3>
      <div className="r">
        <div className="t">
          <span className="s">
            {c.label} <Sample />
          </span>
          <ClockIcon className="ic-muted" />
        </div>
        <b className="big-b">{c.name}</b>
        <span className="s row-i">
          <PinIcon className="ic-muted" /> {c.place}
        </span>
        <span className="ch on self-start">{c.time}</span>
      </div>
    </div>
  );
}

export function TelegramCard() {
  const c = t.cards.telegram;
  return (
    <div className="k">
      <h3>{c.title}</h3>
      <ol className="steps">
        {c.steps.map((label, i) => (
          <li key={label}>
            {i === 0 ? <TelegramMark className="tgm-s" /> : <span className="num">{i + 1}</span>}
            <span>{label}</span>
          </li>
        ))}
      </ol>
      <div className="s mt row-i">
        <CheckIcon className="ic-muted" /> {c.note}
      </div>
    </div>
  );
}

export function StickyNote() {
  return (
    <div className="note">
      <i className="pin" aria-hidden />
      {t.cards.note}
    </div>
  );
}

export function ClubCard() {
  const c = t.cards.club;
  return (
    <div className="k">
      <div className="t mb">
        <h3>{c.title}</h3>
        <Sample />
      </div>
      <div className="row mb">
        <span className="ico">
          <MicIcon />
        </span>
        <div className="grow">
          <b>{c.when}</b>
          <div className="s row-i">
            <PinIcon className="ic-muted" /> {c.place} · {c.members}
          </div>
        </div>
      </div>
      <span className="btn w">{c.join}</span>
      <div className="t sep">
        <span className="s">{c.attended}</span>
        <span className="ch row-i">
          <CheckIcon className="ic-ink" /> {c.qr}
        </span>
      </div>
    </div>
  );
}

export function OpportunityCard() {
  const c = t.cards.opportunity;
  return (
    <div className="k">
      <div className="t mb">
        <h3>{c.title}</h3>
        <Sample />
      </div>
      <div className="s mb">{c.organizer}</div>
      <div className="g mb">
        <span className="ch on">{c.type}</span>
        <span className="ch">{c.age}</span>
        <span className="ch">{c.region}</span>
      </div>
      <div className="dl">
        <span className="s">{c.deadlineLabel}</span>
        <b className="ink">{c.deadline}</b>
      </div>
      <div className="t sep">
        <span className="s row-i">
          <CheckIcon className="ic-muted" /> {c.verified}
        </span>
        <span className="link row-i">
          {c.link} <ArrowUpRightIcon className="ic-ink" />
        </span>
      </div>
    </div>
  );
}

export function IdeaCard() {
  const c = t.cards.idea;
  return (
    <div className="k">
      <div className="t mb">
        <span className="s row-i">
          <UsersIcon className="ic-muted" /> {c.filled}
        </span>
        <Sample />
      </div>
      <h3 className="h3-tight">{c.title}</h3>
      <p className="s mb">{c.problem}</p>
      <div className="g mb">
        {c.roles.map((r) => (
          <span className="ch" key={r}>
            {r}
          </span>
        ))}
      </div>
      <div className="row">
        <Bar value={33} />
        <span className="btn">{c.join}</span>
      </div>
    </div>
  );
}
