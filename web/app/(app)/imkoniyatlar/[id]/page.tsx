import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink, ReportLink, SampleNotice } from "@/components/app/blocks";
import { ArrowUpRightIcon, BookmarkIcon, CheckIcon } from "@/components/icons";
import { daysLeft, formatDate, getOpportunity, isClosed, opportunities } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

export function generateStaticParams() {
  return opportunities.map((o) => ({ id: o.id }));
}

export async function generateMetadata(props: PageProps<"/imkoniyatlar/[id]">): Promise<Metadata> {
  const o = getOpportunity((await props.params).id);
  return { title: o ? `${o.title} · ${t.brand}` : t.brand };
}

export default async function OpportunityPage(props: PageProps<"/imkoniyatlar/[id]">) {
  const o = getOpportunity((await props.params).id);
  if (!o) notFound();
  const c = t.app.opps;
  const closed = isClosed(o);
  const left = daysLeft(o.closes_at);

  return (
    <>
      <BackLink href="/imkoniyatlar" />
      <SampleNotice />
      <div className="detail">
        <div className="stack">
          <div className="pnl">
            <div className="chips">
              <span className="ch on">{o.type}</span>
              <span className="nm">{t.sample}</span>
            </div>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginTop: 14 }}>{o.title}</h1>
            <div className="meta" style={{ marginTop: 8 }}>
              <span>{o.organizer}</span>
            </div>
            <p style={{ marginTop: 14 }}>{o.summary}</p>
          </div>
          <div className="pnl">
            <dl className="dl">
              <div>
                <dt>{c.eligibility}</dt>
                <dd>{o.eligibility}</dd>
              </div>
              <div>
                <dt>{c.ageRange}</dt>
                <dd>
                  {o.age_min}–{o.age_max} {c.age}
                </dd>
              </div>
              <div>
                <dt>{c.region}</dt>
                <dd>{o.region}</dd>
              </div>
              <div>
                <dt>{c.organizer}</dt>
                <dd>{o.organizer}</dd>
              </div>
            </dl>
          </div>
        </div>

        <aside>
          <div className="pnl stack">
            <div className={`due ${closed ? "closed" : ""}`}>
              <span>{c.deadline}</span>
              <b>{formatDate(o.closes_at)}</b>
            </div>
            {closed ? (
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                {c.closedNote}
              </p>
            ) : (
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                {left === 0 ? t.app.today.lastDay : `${left} ${t.app.today.daysLeft}`}
              </p>
            )}
            <a
              href={o.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w"
              aria-disabled={closed ? "true" : undefined}
            >
              {c.official} <ArrowUpRightIcon />
            </a>
            <Link href="/kirish" className="btn ghost w">
              <BookmarkIcon /> {c.save}
            </Link>
            <div className="meta">
              <span>
                <CheckIcon /> {c.verified}: {formatDate(o.verified_at)}
              </span>
            </div>
          </div>
          <ReportLink label={c.stale} />
        </aside>
      </div>
    </>
  );
}
