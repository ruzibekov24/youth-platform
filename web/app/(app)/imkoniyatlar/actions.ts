"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { allow } from "@/lib/rate-limit";
import { isUuid } from "@/lib/validate";

export async function saveOpportunity(id: string) {
  const u = await getCurrentUser();
  if (!u) redirect(`/kirish?next=/imkoniyatlar/${id}`);
  if (!isUuid(id) || !(await allow(`write:${u.id}`, 60, 30))) return;
  const r = await db()
    .from("saved_opportunities")
    .upsert({ user_id: u.id, opportunity_id: id }, { onConflict: "user_id,opportunity_id", ignoreDuplicates: true });
  if (r.error) throw r.error;
  await trackEvent(u.id, "opportunity_save", "opportunity", id);
  revalidatePath(`/imkoniyatlar/${id}`);
}

export async function unsaveOpportunity(id: string) {
  const u = await getCurrentUser();
  if (!u) redirect(`/kirish?next=/imkoniyatlar/${id}`);
  if (!isUuid(id) || !(await allow(`write:${u.id}`, 60, 30))) return;
  const r = await db().from("saved_opportunities").delete().eq("user_id", u.id).eq("opportunity_id", id);
  if (r.error) throw r.error;
  revalidatePath(`/imkoniyatlar/${id}`);
}
