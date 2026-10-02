import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { reportEntity } from "@/app/actions/report";
import { BackLink, Section } from "@/components/app/blocks";
import { JoinForm, ReportButton } from "@/components/app/forms";
import { groupLabel } from "@/components/app/items";
import { ShieldIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { getCurrentUser } from "@/lib/auth";
import { formatDay } from "@/lib/format";
import { getIdeaPage } from "@/lib/ideas";
import { t } from "@/lib/strings.uz";
import { closeIdea, decideRequest, requestJoin } from "../actions";

export async function generateMetadata(props: PageProps<"/miya/[id]">): Promise<Metadata> {
  const page = await getIdeaPage((await props.params).id, await getCurrentUser());
  return { title: page ? `${page.idea.title} · ${t.brand}` : t.brand };
}

export default async function IdeaPage(props: PageProps<"/miya/[id]">) {
  const { id } = await props.params;
  const user = await getCurrentUser();
  const page = await getIdeaPage(id, user);
  if (!page) notFound();
  const { idea, description, isOwner, sameGroup, authorName, myRequest, requests } = page;
  const c = t.app.miya;
  const m = t.miya;
  const statusText = myRequest ? m.join[myRequest.status] : null;

  return (
    <>
      <BackLink href="/miya" />
      {idea.status === "pending" && <p className="notice">{m.pendingNote}</p>}
      {idea.status === "closed" && <p className="notice">{m.closedNote}</p>}
      <div className="detail">
        <div className="stack">
          <div className="pnl">
            <div className="chips">
              <span className="ch">{groupLabel(idea.age_group)}</span>
            </div>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginTop: 14 }}>{idea.title}</h1>
            <div className="meta" style={{ marginTop: 8 }}>
              {authorName && (
                <span>
                  {m.author}: {authorName}
                </span>
              )}
              <span>{formatDay(idea.created_at)}</span>
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
                <dd style={{ whiteSpace: "pre-line" }}>{description}</dd>
              </div>
            </dl>
          </div>

          {isOwner && (
            <Section title={m.owner.requests}>
              {requests.length ? (
                <div className="roles">
                  {requests.map((r) => (
                    <div key={r.id} className="pnl stack">
                      <div className="t-row">
                        <b>{r.first_name ?? "…"}</b>
                        <span className="ch">{m.owner.roleOf(r.role)}</span>
                      </div>
                      <p style={{ margin: 0 }}>{r.message}</p>
                      {r.status === "pending" ? (
                        <div className="chips">
                          <form action={decideRequest.bind(null, r.id, "accepted")}>
                            <button type="submit" className="btn">
                              {m.owner.accept}
                            </button>
                          </form>
                          <form action={decideRequest.bind(null, r.id, "declined")}>
                            <button type="submit" className="btn ghost">
                              {m.owner.decline}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="muted" style={{ fontSize: 13 }}>
                          {m.join[r.status]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="notice">{m.owner.none}</p>
              )}
              {idea.status !== "closed" && (
                <form action={closeIdea.bind(null, idea.id)} style={{ marginTop: 14 }}>
                  <button type="submit" className="btn ghost">
                    {m.owner.close}
                  </button>
                </form>
              )}
            </Section>
          )}
        </div>

        <aside>
          <div className="pnl stack">
            <div className="t-row">
              <h3>{c.roles}</h3>
              <Tile name="puzzle" size={40} className="tile-sm tile-xs" />
            </div>
            <div className="chips">
              {idea.needed_roles.map((r) => (
                <span key={r} className="ch">
                  {r}
                </span>
              ))}
            </div>
            {idea.status === "open" &&
              (!user ? (
                <Link href={`/kirish?next=/miya/${idea.id}`} className="btn w">
                  {m.join.loginToJoin}
                </Link>
              ) : isOwner ? (
                <p className="ok-note">{m.join.own}</p>
              ) : !sameGroup ? (
                <p className="ok-note">{m.join.sameGroupOnly}</p>
              ) : statusText ? (
                <p className="ok-note" role="status">
                  {statusText}
                </p>
              ) : (
                <JoinForm action={requestJoin.bind(null, idea.id)} roles={idea.needed_roles} />
              ))}
            <div className="meta qr-note">
              <ShieldIcon />
              <span>{c.safety}</span>
            </div>
          </div>
          <ReportButton action={reportEntity.bind(null, "idea", idea.id)} />
        </aside>
      </div>
    </>
  );
}
