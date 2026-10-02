import type { Metadata } from "next";
import { PageHead, SampleNotice } from "@/components/app/blocks";
import { ClubItem } from "@/components/app/items";
import { clubs } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.clubs.title} · ${t.brand}` };

export default function ClubsPage() {
  const c = t.app.clubs;
  return (
    <>
      <PageHead title={c.title} lead={c.lead} />
      <SampleNotice />
      <div className="grid3">
        {clubs.map((club) => (
          <ClubItem key={club.slug} club={club} />
        ))}
      </div>
    </>
  );
}
