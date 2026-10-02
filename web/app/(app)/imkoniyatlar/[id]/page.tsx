import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { reportEntity } from "@/app/actions/report";
import { BackLink } from "@/components/app/blocks";
import { ReportButton } from "@/components/app/forms";
import { Sample } from "@/components/app/items";
import { ArrowUpRightIcon, BookmarkIcon, CheckIcon } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { ageLabel, daysLeft, formatDay, isClosed } from "@/lib/format";
import { getOpportunityPage } from "@/lib/opportunities";
import { t } from "@/lib/strings.uz";
import { saveOpportunity, unsaveOpportunity } from "../actions";

export async function generateMetadata(props: PageProps<"/imkoniyatlar/[id]">): Promise<Metadata> {
  const page = await getOpportunityPage((await props.params).id, null);
  return { title: page ? `${page.opp.title} · ${t.brand}` : t.brand };
}

export default async function OpportunityPage(props: PageProps<"/imkoniyatlar/[id]">) {
  const { id } = await props.params;
  const user = await getCurrentUser();
  const page = await getOpportunityPage(id, user?.id ?? null);
  if (!page) notFound();
  const { opp: o, saved } = page;
  const c = t.app.opps;
  const closed = isClosed(o.closes_at);
  const left = o.closes_at ? daysLeft(o.closes_at) : null;

  return (
    <>
      <BackLink href="/imkoniyatlar" />
      <div className="detail">
        <div className="stack">
          <div className="pnl">
            <div className="chips">
              <span className="ch on">{t.opp.types[o.type]}</span>
              <Sample on={o.is_sample} />
            </div>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginTop: 14 }}>{o.title}</h1>
            <div className="meta" style={{ marginTop: 8 }}>
              <span>{o.organizer}</span>
            </div>
          </div>
          <div className="pnl">
            <dl className="dl">
              <div>
                <dt>{c.eligibility}</dt>
                <dd>{o.eligibility}</dd>
              </div>
              <div>
                <dt>{c.ageRange}</dt>
                <dd>{ageLabel(o.age_min, o.age_max)}</dd>
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
              <b>{o.closes_at ? formatDay(o.closes_at) : t.opp.noDeadline}</b>
            </div>
            {closed ? (
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                {c.closedNote}
              </p>
            ) : (
              left !== null && (
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                  {left <= 1 ? t.app.today.lastDay : `${left} ${t.app.today.daysLeft}`}
                </p>
              )
            )}
            {/* /go/[id] bosilishni hisoblaydi, keyin rasmiy sahifaga yo'naltiradi. */}
            <a href={`/go/${o.id}`} target="_blank" rel="noopener noreferrer" className="btn w">
              {c.official} <ArrowUpRightIcon />
            </a>
            {!user ? (
              <Link href={`/kirish?next=/imkoniyatlar/${o.id}`} className="btn ghost w">
                <BookmarkIcon /> {c.save}
              </Link>
            ) : (
              <form action={(saved ? unsaveOpportunity : saveOpportunity).bind(null, o.id)}>
                <button type="submit" className="btn ghost w" aria-pressed={saved}>
                  <BookmarkIcon /> {saved ? t.opp.saved : c.save}
                </button>
              </form>
            )}
            <div className="meta">
              <span>
                <CheckIcon /> {c.verified}: {formatDay(o.verified_at)}
              </span>
            </div>
          </div>
          <ReportButton action={reportEntity.bind(null, "opportunity", o.id)} label={c.stale} />
        </aside>
      </div>
    </>
  );
}
