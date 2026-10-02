import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink, ReportLink, SampleNotice } from "@/components/app/blocks";
import { TeamBar } from "@/components/app/items";
import { CheckIcon, ShieldIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { formatDate, getIdea, ideas } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

export function generateStaticParams() {
  return ideas.map((i) => ({ id: i.id }));
}

export async function generateMetadata(props: PageProps<"/miya/[id]">): Promise<Metadata> {
  const idea = getIdea((await props.params).id);
  return { title: idea ? `${idea.title} · ${t.brand}` : t.brand };
}

export default async function IdeaPage(props: PageProps<"/miya/[id]">) {
  const idea = getIdea((await props.params).id);
  if (!idea) notFound();
  const c = t.app.miya;

  return (
    <>
      <BackLink href="/miya" />
      <SampleNotice />
      <div className="detail">
        <div className="stack">
          <div className="pnl">
            <div className="chips">
              <span className="ch">
                {c.ageGroup}: {idea.age_group}
              </span>
              <span className="nm">{t.sample}</span>
            </div>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginTop: 14 }}>{idea.title}</h1>
            <div className="meta" style={{ marginTop: 8 }}>
              <span>{formatDate(idea.created_at)}</span>
            </div>
          </div>
          <div className="pnl">
            <dl className="dl">
              <div>
                <dt>{c.problem}</dt>
                <dd>{idea.problem}</dd>
              </div>
              <div>
                <dt>{c.idea}</dt>
                <dd>{idea.description}</dd>
              </div>
            </dl>
          </div>
        </div>

        <aside>
          <div className="pnl stack">
            <div className="t-row">
              <h3>{c.roles}</h3>
              <Tile name="puzzle" size={40} className="tile-sm tile-xs" />
            </div>
            <TeamBar idea={idea} />
            <div className="roles">
              {idea.roles.map((r) =>
                r.filled ? (
                  <div key={r.name} className="role is-filled">
                    <span>{r.name}</span>
                    <span className="st meta">
                      <CheckIcon /> {c.filled}
                    </span>
                  </div>
                ) : (
                  <div key={r.name} className="role">
                    <span>
                      {r.name}
                      <span className="st" style={{ display: "block" }}>
                        {c.open}
                      </span>
                    </span>
                    <Link href="/kirish" className="btn">
                      {c.join}
                    </Link>
                  </div>
                ),
              )}
            </div>
            <div className="meta qr-note">
              <ShieldIcon />
              <span>{c.safety}</span>
            </div>
          </div>
          <ReportLink />
        </aside>
      </div>
    </>
  );
}
