"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/events";

async function user(slug: string) {
  const u = await getCurrentUser();
  if (!u) redirect(`/kirish?next=/klublar/${slug}`);
  return u;
}

export async function joinClub(clubId: string, slug: string) {
  const u = await user(slug);
  const r = await db()
    .from("club_members")
    .upsert({ club_id: clubId, user_id: u.id }, { onConflict: "club_id,user_id", ignoreDuplicates: true });
  if (r.error) throw r.error;
  await trackEvent(u.id, "club_join", "club", clubId);
  revalidatePath(`/klublar/${slug}`);
}

export async function leaveClub(clubId: string, slug: string) {
  const u = await user(slug);
  const r = await db().from("club_members").delete().eq("club_id", clubId).eq("user_id", u.id);
  if (r.error) throw r.error;
  revalidatePath(`/klublar/${slug}`);
}
