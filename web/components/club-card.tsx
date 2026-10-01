import Link from "next/link";
import { Badge, SampleBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/strings.uz";
import type { Club } from "@/lib/types";

export function ClubCard({ club }: { club: Club }) {
  return (
    <Card className="relative flex h-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <Badge tone="accent">{t.nav.clubs}</Badge>
        {club.is_sample && <SampleBadge />}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">
        <Link href={`/klublar/${club.slug}`} className="after:absolute after:inset-0">
          {club.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted">{club.description}</p>
      <p className="mt-auto pt-4 text-sm font-medium">{club.schedule_text}</p>
    </Card>
  );
}
