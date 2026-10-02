import Image from "next/image";
import {
  ClubCard,
  IdeaCard,
  OpportunityCard,
  RemindersCard,
  StickyNote,
  TelegramCard,
  TodayCard,
} from "@/components/cards/cards";
import { ArrowCircleIcon, TelegramMark } from "@/components/cards/icons";
import { t } from "@/lib/strings.uz";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ScrollEngine } from "./scroll-engine";
import "./landing.css";

type IconName =
  | "base" | "calendar" | "check" | "qr" | "bulb" | "cap" | "mic"
  | "team" | "key" | "bookmark" | "medal" | "puzzle" | "shield" | "pin" | "bell";

function Tile({ name, size, className }: { name: IconName; size: number; className?: string }) {
  return (
    <Image
      src={`/brand/icons/${name}.png`}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
    />
  );
}

function Nav() {
  return (
    <nav className="nav" id="site-nav" aria-label="Asosiy">
      <a href="#hero" className="logo" aria-label={t.brand}>
        <Image src="/brand/logo.svg" alt={t.brand} width={98} height={26} className="lg-l" priority />
        <Image src="/brand/logo-white.svg" alt="" width={98} height={26} className="lg-d" aria-hidden />
      </a>
      <div className="links">
        {t.nav.links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav-r">
        <ThemeToggle />
        <a className="btn blk" href="/kirish">
          {t.nav.login}
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const h = t.hero;
  return (
    <section className="hero" id="hero" data-scene="top">
      <div className="frame">
        <div className="hero-copy">
          <Tile name="base" size={76} className="tc" />
          <h1 className="ld">
            <span className="line" style={{ "--i": 0 } as React.CSSProperties}>
              <span>{h.title}</span>
            </span>
            <span className="line muted" style={{ "--i": 1 } as React.CSSProperties}>
              <span>{h.titleMuted}</span>
            </span>
          </h1>
          <p className="lead ld2">{h.lead}</p>
          <div className="cta ld2">
            <a className="btn" href="#makonlar">
              {h.primary} <ArrowCircleIcon />
            </a>
            <a className="btn ghost" href="#">
              {h.secondary}
            </a>
          </div>
          <div className="mobtiles ld2" aria-hidden>
            <Tile name="mic" size={58} />
            <Tile name="calendar" size={58} />
            <Tile name="bulb" size={58} />
          </div>
        </div>

        {/* Bezak kartalar (NAMUNA). Ekran o'quvchilar uchun yashirilgan. */}
        <div className="deco" aria-hidden style={{ "--k": 0, left: "3.5%", top: "15%" } as React.CSSProperties} data-par="30">
          <div className="note-wrap">
            <StickyNote />
            <Tile name="calendar" size={74} className="tl note-tile" />
          </div>
        </div>
        <div className="deco" aria-hidden style={{ "--k": 1, right: "3.5%", top: "13%" } as React.CSSProperties} data-par="60">
          <div className="with-tile">
            <Tile name="bell" size={66} className="tl corner" />
            <RemindersCard />
          </div>
        </div>
        <div className="deco" aria-hidden style={{ "--k": 2, left: "4%", bottom: "-28px" } as React.CSSProperties} data-par="90">
          <TodayCard />
        </div>
        <div className="deco" aria-hidden style={{ "--k": 3, right: "4%", bottom: "-28px" } as React.CSSProperties} data-par="110">
          <TelegramCard />
        </div>
      </div>
    </section>
  );
}

function Orbit() {
  const o = t.orbit;
  return (
    <section className="scene s1" data-scene="pin">
      <div className="stick">
        <div className="s1-grid">
          <div>
            <h2>
              <span className="line">
                <span data-a=".04" data-b=".2" data-yp="110">{o.line1}</span>
              </span>
              <span className="line">
                <span data-a=".1" data-b=".26" data-yp="110">
                  {o.line2}{" "}
                  <span className="mk" data-a=".26" data-b=".4">
                    {o.mark}
                  </span>
                </span>
              </span>
            </h2>
            <p className="s1-text" data-a=".34" data-b=".5" data-y="16" data-o="0">
              {o.text}
            </p>
            <div className="btnrow" data-a=".44" data-b=".58" data-y="16" data-o="0">
              <a className="btn" href="#makonlar">
                {o.cta} <ArrowCircleIcon />
              </a>
            </div>
          </div>
          <div className="orb" aria-hidden>
            <div className="orb-ring r1" data-a=".08" data-b=".35" data-s=".5" data-o="0" />
            <div className="orb-ring r2" data-a=".14" data-b=".4" data-s=".5" data-o="0" />
            <div className="orb-ring r3" data-a=".2" data-b=".45" data-s=".5" data-o="0" />
            <div className="core" data-a=".18" data-b=".42" data-s=".4" data-o="0">
              <Image src="/brand/mark.svg" alt="" width={44} height={40} className="mk-l" />
              <Image src="/brand/mark-white.svg" alt="" width={44} height={40} className="mk-d" />
            </div>
            <div className="spin" data-a=".25" data-b=".5" data-o="0">
              <Tile name="calendar" size={60} className="chip c-top" />
              <Tile name="cap" size={60} className="chip c-bottom" />
            </div>
            <div className="spin b" data-a=".3" data-b=".55" data-o="0">
              <Tile name="bulb" size={60} className="chip c-left" />
              <Tile name="mic" size={60} className="chip c-right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spaces() {
  const s = t.spaces;
  const c = t.cards;
  const items = [
    { card: <ClubCard key="c" />, caption: c.club.caption, text: c.club.text },
    { card: <OpportunityCard key="o" />, caption: c.opportunity.caption, text: c.opportunity.text },
    { card: <IdeaCard key="i" />, caption: c.idea.caption, text: c.idea.text },
  ];
  return (
    <section className="scene s2" data-scene="pin" id="makonlar">
      <div className="stick">
        <div className="s2-in">
          <span className="pill" data-a=".02" data-b=".12" data-y="10" data-o="0">
            {s.pill}
          </span>
          <h2>
            <span className="line">
              <span data-a=".05" data-b=".2" data-yp="110">{s.line1}</span>
            </span>
            <span className="line">
              <span data-a=".1" data-b=".25" data-yp="110">{s.line2}</span>
            </span>
          </h2>
          <div className="spaces">
            {items.map((it, i) => (
              <div
                className="space"
                key={it.caption}
                data-a={String(0.18 + i * 0.06)}
                data-b={String(0.5 + i * 0.06)}
                data-y="380"
                data-o="0"
              >
                <div className="space-card" aria-hidden>
                  {it.card}
                </div>
                <h3>{it.caption}</h3>
                <p>{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Flow() {
  const f = t.flow;
  const shift = [300, 100, -100, -300];
  return (
    <section className="scene s3" data-scene="pin" id="yol">
      <div className="stick">
        <div className="s3-in">
          <div className="icons" aria-hidden>
            {(["mic", "bulb", "check"] as const).map((n, i) => (
              <span key={n} data-a={String(0.02 + i * 0.04)} data-b={String(0.14 + i * 0.04)} data-s=".3" data-o="0" data-ease="back">
                <Tile name={n} size={46} />
              </span>
            ))}
          </div>
          <h2>
            <span className="line">
              <span data-a=".08" data-b=".24" data-yp="110">{f.line1}</span>
            </span>
            <span className="line">
              <span data-a=".12" data-b=".28" data-yp="110">{f.line2}</span>
            </span>
          </h2>
          <p className="s3-text" data-a=".22" data-b=".36" data-y="12" data-o="0">
            {f.text}
          </p>
          <div data-a=".3" data-b=".42" data-s=".7" data-o="0" data-ease="back">
            <span className="btn is-static">{f.root}</span>
          </div>
          <div className="tree">
            <svg viewBox="0 0 900 56" preserveAspectRatio="none" aria-hidden>
              <path
                pathLength={1}
                data-a=".4"
                data-b=".62"
                d="M450 0V22M450 22H112M450 22H337M450 22H562M450 22H787M112 22V56M337 22V56M562 22V56M787 22V56"
              />
            </svg>
            <ol className="leaves">
              {f.leaves.map((l, i) => (
                <li
                  key={l.title}
                  className="leaf"
                  data-a={i === 0 || i === 3 ? ".55" : ".58"}
                  data-b={i === 0 || i === 3 ? ".8" : ".83"}
                  data-x={String(shift[i])}
                  data-o="0"
                >
                  <b>{l.title}</b>
                  <span>{l.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Safety() {
  const s = t.safety;
  return (
    <section className="scene s4" data-scene="pin" data-dark id="xavfsizlik">
      <div className="stick">
        <div className="s4-in">
          <div data-a=".72" data-b=".84" data-out>
            <span className="pill" data-a=".02" data-b=".12" data-y="10" data-o="0">
              {s.pill}
            </span>
            <h2>
              <span className="line">
                <span data-a=".05" data-b=".2" data-yp="110">{s.line1}</span>
              </span>
              <span className="line">
                <span data-a=".1" data-b=".25" data-yp="110">
                  <span className="mk" data-a=".25" data-b=".4">
                    {s.mark}
                  </span>{" "}
                  {s.line2}
                </span>
              </span>
            </h2>
            <div className="deck">
              <ul className="safe" data-a=".28" data-b=".6" data-rx="55" data-y="260" data-s=".8" data-o="0">
                {s.items.map((it) => (
                  <li key={it.title}>
                    <b>{it.title}</b>
                    {it.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="fin">
            <h2 className="fin-title" data-a=".8" data-b=".92" data-y="30" data-o="0">
              {s.finTitle}
            </h2>
            <div className="fin-actions" data-a=".86" data-b=".97" data-y="24" data-o="0">
              <a className="btn tg-btn" href="#">
                <TelegramMark className="tgm-btn" mono />
                {s.cta}
              </a>
              <a className="btn ghost-dark" href="#makonlar">
                {s.ctaSecondary}
              </a>
            </div>
            <p className="fin-note" data-a=".9" data-b="1" data-o="0">
              {s.finNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <Image src="/brand/logo-white.svg" alt={t.brand} width={98} height={26} />
      <p>{t.footer}</p>
    </footer>
  );
}

export function Landing() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Orbit />
        <Spaces />
        <Flow />
        <Safety />
      </main>
      <Footer />
      <ScrollEngine />
    </>
  );
}
