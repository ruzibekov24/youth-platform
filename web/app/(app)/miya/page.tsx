import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SampleNotice } from "@/components/app/blocks";
import { IdeaItem } from "@/components/app/items";
import { PlusIcon, ShieldIcon } from "@/components/icons";
import { ideas } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.miya.title} · ${t.brand}` };

export default function MiyaPage() {
  const c = t.app.miya;
  return (
    <>
      <PageHead
        title={c.title}
        lead={c.lead}
        action={
          <Link href="/miya/yangi" className="btn">
            <PlusIcon /> {c.add}
          </Link>
        }
      />
      <SampleNotice />
      <div className="grid3">
        {ideas.map((i) => (
          <IdeaItem key={i.id} idea={i} />
        ))}
      </div>
      <p className="meta" style={{ marginTop: 20 }}>
        <span>
          <ShieldIcon /> {c.moderation}
        </span>
      </p>
    </>
  );
}
