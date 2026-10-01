import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Idea } from "@/lib/types";

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Card className="relative flex h-full flex-col">
      <div className="flex flex-wrap gap-1.5">
        {idea.needed_roles.slice(0, 3).map((r) => (
          <Badge key={r} tone="accent">
            {r}
          </Badge>
        ))}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">
        <Link href={`/miya/${idea.id}`} className="after:absolute after:inset-0">
          {idea.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-3 text-sm text-muted">{idea.problem}</p>
    </Card>
  );
}
