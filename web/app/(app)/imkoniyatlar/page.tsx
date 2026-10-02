import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SampleNotice } from "@/components/app/blocks";
import { OpportunityItem } from "@/components/app/items";
import { isClosed } from "@/lib/format";
import { OPP_TYPES, sortOpportunities } from "@/lib/opp-filter";
import { listActiveOpportunities } from "@/lib/opportunities";
import { t } from "@/lib/strings.uz";

export const metadata: Metadata = { title: `${t.app.opps.title} · ${t.brand}` };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function OpportunitiesPage(props: PageProps<"/imkoniyatlar">) {
  const c = t.app.opps;
  const sp = await props.searchParams;
  const type = OPP_TYPES.find((x) => x === one(sp.tur));
  const h = one(sp.holat);
  const status = h === "yopilgan" || h === "hammasi" ? h : "ochiq";

  const all = await listActiveOpportunities();
  const list = sortOpportunities(
    all
      .filter((o) => !type || o.type === type)
      .filter((o) => (status === "hammasi" ? true : status === "yopilgan" ? isClosed(o.closes_at) : !isClosed(o.closes_at))),
  );

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
  const chip = (on: boolean) => ({ className: on ? "on" : undefined, "aria-current": on ? ("true" as const) : undefined });

  return (
    <>
      <PageHead title={c.title} lead={c.lead} />
      <SampleNotice show={list.some((o) => o.is_sample)} />
      <div className="filters">
        <div className="fl" role="group" aria-label={c.filterType}>
          <span className="fl-l">{c.filterType}</span>
          <Link href={href({ tur: undefined })} {...chip(!type)}>
            {c.all}
          </Link>
          {OPP_TYPES.map((x) => (
            <Link key={x} href={href({ tur: x })} {...chip(type === x)}>
              {t.opp.types[x]}
            </Link>
          ))}
        </div>
        <div className="fl" role="group" aria-label={c.filterStatus}>
          <span className="fl-l">{c.filterStatus}</span>
          {statuses.map((s) => (
            <Link key={s.v} href={href({ holat: s.v })} {...chip(status === s.v)}>
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
        <p className="notice">{all.length ? c.empty : t.opp.emptyAll}</p>
      )}
    </>
  );
}
