import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SampleNotice } from "@/components/app/blocks";
import { OpportunityItem } from "@/components/app/items";
import { isClosed, opportunities, type OpportunityType } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.opps.title} · ${t.brand}` };

const TYPES: OpportunityType[] = ["Stipendiya", "Dastur", "Tanlov", "Volontyorlik", "Amaliyot"];

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function OpportunitiesPage(props: PageProps<"/imkoniyatlar">) {
  const c = t.app.opps;
  const sp = await props.searchParams;
  const type = TYPES.find((x) => x === one(sp.tur));
  const status = one(sp.holat) === "yopilgan" ? "yopilgan" : one(sp.holat) === "hammasi" ? "hammasi" : "ochiq";

  const list = opportunities
    .filter((o) => !type || o.type === type)
    .filter((o) => (status === "hammasi" ? true : status === "yopilgan" ? isClosed(o) : !isClosed(o)))
    .sort((a, b) => a.closes_at.localeCompare(b.closes_at));

  // Filtr havolalari: joriy holatni saqlab, bitta qiymatni almashtiradi.
  const href = (next: { tur?: string; holat?: string }) => {
    const q = new URLSearchParams();
    const tur = "tur" in next ? next.tur : type;
    const holat = "holat" in next ? next.holat : status;
    if (tur) q.set("tur", tur);
    if (holat && holat !== "ochiq") q.set("holat", holat);
    const s = q.toString();
    return s ? `/imkoniyatlar?${s}` : "/imkoniyatlar";
  };
  const statuses = [
    { v: "ochiq", label: c.open },
    { v: "yopilgan", label: c.closed },
    { v: "hammasi", label: c.all },
  ];

  return (
    <>
      <PageHead title={c.title} lead={c.lead} />
      <SampleNotice />
      <div className="filters">
        <div className="fl" role="group" aria-label={c.filterType}>
          <span className="fl-l">{c.filterType}</span>
          <Link href={href({ tur: undefined })} className={!type ? "on" : undefined} aria-current={!type ? "true" : undefined}>
            {c.all}
          </Link>
          {TYPES.map((x) => (
            <Link key={x} href={href({ tur: x })} className={type === x ? "on" : undefined} aria-current={type === x ? "true" : undefined}>
              {x}
            </Link>
          ))}
        </div>
        <div className="fl" role="group" aria-label={c.filterStatus}>
          <span className="fl-l">{c.filterStatus}</span>
          {statuses.map((s) => (
            <Link key={s.v} href={href({ holat: s.v })} className={status === s.v ? "on" : undefined} aria-current={status === s.v ? "true" : undefined}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
      {list.length ? (
        <div className="rows">
          {list.map((o) => (
            <OpportunityItem key={o.id} o={o} />
          ))}
        </div>
      ) : (
        <p className="notice">{c.empty}</p>
      )}
    </>
  );
}
