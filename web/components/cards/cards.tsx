import { t } from "@/lib/strings.uz";
import { BellIcon, CalendarIcon, ClockIcon, DocIcon, MicIcon, TelegramMark } from "./icons";

// Rang qoidasi: brend ko'ki faqat asosiy tugma va progressda; faol chip qora; sariq faqat NAMUNA.

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
  const icons = [MicIcon, DocIcon];
  return (
    <div className="k">
      <h3>{c.title}</h3>
      {c.rows.map((r, i) => {
        const Icon = icons[i];
        return (
          <div className="r" key={r.title}>
            <div className="t">
              <div className="row">
                <span className="ico">
                  <Icon />
                </span>
                <div>
                  <b>{r.title}</b>
                  <div className="s">{r.sub}</div>
                </div>
              </div>
              <Sample />
            </div>
            <div className="row">
              <Bar value={r.progress} />
              <span className="s">{r.progress}%</span>
            </div>
          </div>
        );
      })}
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
        <span className="ch on self-start">{c.time}</span>
      </div>
    </div>
  );
}

export function TelegramCard() {
  const c = t.cards.telegram;
  const marks = [
    <TelegramMark key="tg" className="tgm" />,
    <span key="cal" className="ico">
      <CalendarIcon />
    </span>,
    <span key="bell" className="ico">
      <BellIcon />
    </span>,
  ];
  return (
    <div className="k">
      <h3>{c.title}</h3>
      <div className="apps">
        {c.items.map((label, i) => (
          <div className="r app" key={label}>
            {marks[i]}
            <span className="s">{label}</span>
          </div>
        ))}
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
      <h3>{c.title}</h3>
      <div className="t mb">
        <div className="row">
          <span className="ico">
            <MicIcon />
          </span>
          <span className="s">{c.when}</span>
        </div>
        <Sample />
      </div>
      <span className="btn w">{c.join}</span>
      <div className="t sep">
        <span className="s">{c.attended}</span>
        <span className="ch ok">{c.qr}</span>
      </div>
    </div>
  );
}

export function OpportunityCard() {
  const c = t.cards.opportunity;
  return (
    <div className="k">
      <h3>{c.title}</h3>
      <div className="g mb">
        <span className="ch">{c.type}</span>
        <span className="ch">{c.age}</span>
      </div>
      <div className="s">
        {c.deadlineLabel} <b className="ink">{c.deadline}</b>
      </div>
      <div className="link">{c.link}</div>
      <div className="t mt">
        <span className="ch ok">{c.verified}</span>
        <Sample />
      </div>
    </div>
  );
}

export function IdeaCard() {
  const c = t.cards.idea;
  return (
    <div className="k">
      <h3>{c.title}</h3>
      <div className="skel" />
      <div className="skel short" />
      <div className="g mb">
        {c.roles.map((r) => (
          <span className="ch" key={r}>
            {r}
          </span>
        ))}
      </div>
      <div className="t">
        <span className="btn">{c.join}</span>
        <Sample />
      </div>
    </div>
  );
}
