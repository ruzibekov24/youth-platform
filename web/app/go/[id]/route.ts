import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/events";

export const dynamic = "force-dynamic";

// "Ariza topshirish" bosilishi hisoblanadi (events), keyin rasmiy havolaga yoʻnaltiriladi.
export async function GET(_req: Request, ctx: RouteContext<"/go/[id]">) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Not found", { status: 404 });

  const r = await db().from("opportunities").select("official_url").eq("id", id).eq("status", "active").maybeSingle();
  if (r.error || !r.data) return new NextResponse("Not found", { status: 404 });

  const user = await getCurrentUser();
  await trackEvent(user?.id ?? null, "opportunity_apply", "opportunity", id);
  return NextResponse.redirect(r.data.official_url, 302);
}
