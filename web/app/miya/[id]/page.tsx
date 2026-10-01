import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JoinForm } from "@/components/miya-forms";
import { ReportButton } from "@/components/report-button";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth";
import { getIdeaPage } from "@/lib/ideas";
import { t } from "@/lib/strings.uz";
import { closeIdea, decideRequest } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/miya/[id]">): Promise<Metadata> {
  const page = await getIdeaPage((await params).id, await getCurrentUser());
  return { title: `${page?.idea.title ?? t.miya.title} · ${t.brand}` };
}

export default async function IdeaPage({ params }: PageProps<"/miya/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  const page = await getIdeaPage(id, user);
  if (!page) notFound();
  const { idea, description, isOwner, sameGroup, authorName, myRequest, requests } = page;
  const m = t.miya;

  return (
    <main className="flex-1 py-10">
      <Container className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{idea.age_group === "adult" ? m.groupAdult : m.groupUnder18}</Badge>
          {idea.status === "pending" && <Badge tone="warn">{t.profile.ideaStatus.pending}</Badge>}
          {idea.status === "closed" && <Badge tone="danger">{t.profile.ideaStatus.closed}</Badge>}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{idea.title}</h1>
        {authorName && (
          <p className="mt-1 text-sm text-muted">
            {m.author}: {authorName}
          </p>
        )}

        {idea.status === "pending" && (
          <p className="mt-6 rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">{m.pendingNote}</p>
        )}

        <h2 className="mt-8 text-sm font-medium text-muted">{m.problem}</h2>
        <p className="mt-1 whitespace-pre-line">{idea.problem}</p>
        <h2 className="mt-6 text-sm font-medium text-muted">{m.description}</h2>
        <p className="mt-1 whitespace-pre-line">{description}</p>
        <h2 className="mt-6 text-sm font-medium text-muted">{m.needed}</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {idea.needed_roles.map((r) => (
            <Badge key={r} tone="accent">
              {r}
            </Badge>
          ))}
        </div>

        {idea.status === "open" && !isOwner && (
          <Card className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">{m.join.title}</h2>
            {!user ? (
              <ButtonLink href={`/kirish?next=/miya/${idea.id}`}>{m.join.loginToJoin}</ButtonLink>
            ) : !sameGroup ? (
              <p className="text-sm text-muted">{m.join.sameGroupOnly}</p>
            ) : myRequest ? (
              <p className="font-medium">{m.join[myRequest.status]}</p>
            ) : (
              <JoinForm ideaId={idea.id} roles={idea.needed_roles} />
            )}
          </Card>
        )}

        {isOwner && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">{m.owner.requests}</h2>
            {requests.length ? (
              <ul className="mt-4 space-y-3">
                {requests.map((r) => (
                  <li key={r.id}>
                    <Card className="p-4">
                      <p className="font-medium">{r.first_name}</p>
                      <p className="text-sm text-muted">{m.owner.roleOf(r.role)}</p>
                      <p className="mt-2 whitespace-pre-line text-sm">{r.message}</p>
                      {r.status === "pending" ? (
                        <div className="mt-4 flex gap-2">
                          <form action={decideRequest.bind(null, r.id, "accepted")}>
                            <Button type="submit">{m.owner.accept}</Button>
                          </form>
                          <form action={decideRequest.bind(null, r.id, "declined")}>
                            <Button type="submit" variant="secondary">
                              {m.owner.decline}
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <Badge tone={r.status === "accepted" ? "ok" : "neutral"}>
                            {r.status === "accepted" ? m.owner.accept : m.owner.decline}
                          </Badge>
                        </div>
                      )}
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">{m.owner.none}</p>
            )}
            {idea.status === "open" && (
              <form action={closeIdea.bind(null, idea.id)} className="mt-6">
                <Button type="submit" variant="ghost">
                  {m.owner.close}
                </Button>
              </form>
            )}
          </section>
        )}

        {idea.status === "open" && (
          <div className="mt-12 border-t border-line pt-4">
            <ReportButton entityType="idea" entityId={idea.id} />
          </div>
        )}
      </Container>
    </main>
  );
}
