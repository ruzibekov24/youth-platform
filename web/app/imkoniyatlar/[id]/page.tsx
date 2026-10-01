import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportButton } from "@/components/report-button";
import { Badge, SampleBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth";
import { ageLabel, daysLeft, formatDate, isClosed } from "@/lib/format";
import { getOpportunityPage } from "@/lib/opportunities";
import { t } from "@/lib/strings.uz";
import { saveOpportunity, unsaveOpportunity } from "../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/imkoniyatlar/[id]">): Promise<Metadata> {
  const page = await getOpportunityPage((await params).id, null);
  return { title: `${page?.opp.title ?? t.opp.title} · ${t.brand}` };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  );
}

export default async function OpportunityPage({ params }: PageProps<"/imkoniyatlar/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  const page = await getOpportunityPage(id, user?.id ?? null);
  if (!page) notFound();
  const { opp, saved } = page;
  const o = t.opp;
  const closed = isClosed(opp.closes_at);
  const left = opp.closes_at && !closed ? daysLeft(opp.closes_at) : null;

  return (
    <main className="flex-1 py-10">
      <Container className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{o.types[opp.type]}</Badge>
          {closed && <Badge tone="danger">{o.closed}</Badge>}
          {left !== null && left <= 7 && <Badge tone="warn">{o.daysLeft(left)}</Badge>}
          {opp.is_sample && <SampleBadge />}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{opp.title}</h1>

        <dl className="mt-6 border-t border-line">
          <Row label={o.organizer}>{opp.organizer}</Row>
          <Row label={o.closes}>{opp.closes_at ? formatDate(opp.closes_at) : o.noDeadline}</Row>
          <Row label={t.opp.filterAge}>{ageLabel(opp.age_min, opp.age_max)}</Row>
          <Row label={o.eligibility}>{opp.eligibility}</Row>
          <Row label={o.region}>{opp.region}</Row>
          <Row label={o.verified}>{formatDate(opp.verified_at)}</Row>
        </dl>

        <p className="mt-4 text-sm text-muted">
          {o.sourceNote}: {new URL(opp.official_url).hostname}
        </p>

        {closed && <p className="mt-6 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{o.closedNote}</p>}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!closed && (
            <a
              href={`/go/${opp.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              {o.open}
            </a>
          )}
          {!user ? (
            <ButtonLink href={`/kirish?next=/imkoniyatlar/${opp.id}`} variant="secondary">
              {o.loginToSave}
            </ButtonLink>
          ) : saved ? (
            <form action={unsaveOpportunity.bind(null, opp.id)}>
              <Button type="submit" variant="secondary">
                {o.unsave}
              </Button>
            </form>
          ) : (
            <form action={saveOpportunity.bind(null, opp.id)}>
              <Button type="submit" variant="secondary">
                {o.save}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-12 border-t border-line pt-4">
          <ReportButton entityType="opportunity" entityId={opp.id} label={o.reportLabel} />
        </div>
      </Container>
    </main>
  );
}
