import Link from "next/link";
import { Badge, SampleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ageLabel, daysLeft, formatDate, isClosed } from "@/lib/format";
import { t } from "@/lib/strings.uz";
import type { Opportunity } from "@/lib/types";

export function OpportunityCard({ opp }: { opp: Opportunity }) {
  const closed = isClosed(opp.closes_at);
  const left = opp.closes_at && !closed ? daysLeft(opp.closes_at) : null;

  return (
    <Card className="relative flex h-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <Badge tone="accent">{t.opp.types[opp.type]}</Badge>
        <div className="flex gap-1.5">
          {closed && <Badge tone="danger">{t.opp.closed}</Badge>}
          {left !== null && left <= 7 && <Badge tone="warn">{left} kun qoldi</Badge>}
          {opp.is_sample && <SampleBadge />}
        </div>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">
        <Link href={`/imkoniyatlar/${opp.id}`} className="after:absolute after:inset-0">
          {opp.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted">{opp.organizer}</p>
      <dl className="mt-auto space-y-0.5 pt-4 text-sm">
        {opp.closes_at && (
          <div className="flex gap-1.5">
            <dt className="text-muted">{t.opp.closes}:</dt>
            <dd className="font-medium">{formatDate(opp.closes_at)}</dd>
          </div>
        )}
        <div className="text-muted">{ageLabel(opp.age_min, opp.age_max)}</div>
      </dl>
    </Card>
  );
}
