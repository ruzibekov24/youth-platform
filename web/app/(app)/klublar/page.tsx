import type { Metadata } from "next";
import { PageHead, SampleNotice } from "@/components/app/blocks";
import { ClubItem } from "@/components/app/items";
import { listClubsOverview } from "@/lib/clubs";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.clubs.title} · ${t.brand}` };

export default async function ClubsPage() {
  const c = t.app.clubs;
  const items = await listClubsOverview();
  return (
    <>
      <PageHead title={c.title} lead={c.lead} />
      <SampleNotice show={items.some((i) => i.club.is_sample)} />
      {items.length ? (
        <div className="grid3">
          {items.map((item) => (
            <ClubItem key={item.club.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="notice">{t.club.empty}</p>
      )}
    </>
  );
}
