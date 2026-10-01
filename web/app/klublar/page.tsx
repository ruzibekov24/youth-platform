import type { Metadata } from "next";
import { ClubCard } from "@/components/club-card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { listClubs } from "@/lib/clubs";
import { t } from "@/lib/strings.uz";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.club.title} · ${t.brand}` };

export default async function ClubsPage() {
  const clubs = await listClubs();
  return (
    <main className="flex-1 py-10">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">{t.club.title}</h1>
        <p className="mt-1 text-muted">{t.club.lead}</p>
        <div className="mt-8">
          {clubs.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {clubs.map((c) => (
                <ClubCard key={c.id} club={c} />
              ))}
            </div>
          ) : (
            <EmptyState title={t.club.empty} />
          )}
        </div>
      </Container>
    </main>
  );
}
