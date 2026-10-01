import type { Metadata } from "next";
import { IdeaCard } from "@/components/idea-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth";
import { groupOfUser, listOpenIdeas } from "@/lib/ideas";
import { t } from "@/lib/strings.uz";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.miya.title} · ${t.brand}` };

export default async function MiyaPage() {
  const user = await getCurrentUser();
  const ideas = await listOpenIdeas(user ? groupOfUser(user) : null);

  return (
    <main className="flex-1 py-10">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t.miya.title}</h1>
            <p className="mt-1 max-w-xl text-muted">{t.miya.lead}</p>
          </div>
          <ButtonLink href={user ? "/miya/yangi" : "/kirish?next=/miya/yangi"}>
            {user ? t.miya.newIdea : t.miya.loginToPost}
          </ButtonLink>
        </div>
        <div className="mt-8">
          {ideas.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {ideas.map((i) => (
                <IdeaCard key={i.id} idea={i} />
              ))}
            </div>
          ) : (
            <EmptyState title={t.miya.empty} text={t.miya.emptyText} />
          )}
        </div>
      </Container>
    </main>
  );
}
