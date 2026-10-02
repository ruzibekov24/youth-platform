import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/app/blocks";
import { IdeaItem } from "@/components/app/items";
import { PlusIcon, ShieldIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { getCurrentUser } from "@/lib/auth";
import { groupOfUser, listOpenIdeas } from "@/lib/ideas";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.miya.title} · ${t.brand}` };

export default async function MiyaPage() {
  const c = t.app.miya;
  const user = await getCurrentUser();
  // Kirganlar faqat o'z yosh guruhi g'oyalarini ko'radi.
  const ideas = await listOpenIdeas(user ? groupOfUser(user) : null);
  return (
    <>
      <PageHead
        title={c.title}
        lead={c.lead}
        action={
          <Link href={user ? "/miya/yangi" : "/kirish?next=/miya/yangi"} className="btn">
            <PlusIcon /> {c.add}
          </Link>
        }
      />
      {ideas.length ? (
        <div className="grid3">
          {ideas.map((i) => (
            <IdeaItem key={i.id} idea={i} />
          ))}
        </div>
      ) : (
        <div className="pnl empty">
          <Tile name="bulb" size={64} className="tile-sm" />
          <h2>{t.miya.empty}</h2>
          <p>{t.miya.emptyText}</p>
        </div>
      )}
      <p className="meta" style={{ marginTop: 20 }}>
        <span>
          <ShieldIcon /> {c.moderation}
        </span>
      </p>
    </>
  );
}
