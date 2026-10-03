"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { joinClubAtomic } from "@/lib/clubs";
import { ageAllowed } from "@/lib/cycle";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { allow } from "@/lib/rate-limit";
import { isUuid } from "@/lib/validate";

async function user(slug: string) {
  const u = await getCurrentUser();
  if (!u) redirect(`/kirish?next=/klublar/${slug}`);
  return u;
}

export async function joinClub(clubId: string, slug: string) {
  const u = await user(slug);
  if (!isUuid(clubId) || !(await allow(`write:${u.id}`, 60, 30))) return;

  // Yosh guruhlari aralashmaydi: klubning guruhi bo'lsa, foydalanuvchi shunga mos bo'lishi kerak.
  const c = await db().from("clubs").select("age_group").eq("id", clubId).maybeSingle();
  if (c.error) throw c.error;
  if (!c.data || !ageAllowed(c.data.age_group, u.age_range)) return;

  const result = await joinClubAtomic(clubId, u.id);
  if (result === "ok") await trackEvent(u.id, "club_join", "club", clubId);
  revalidatePath(`/klublar/${slug}`);
}

export async function leaveClub(clubId: string, slug: string) {
  const u = await user(slug);
  if (!isUuid(clubId) || !(await allow(`write:${u.id}`, 60, 30))) return;
  const r = await db().from("club_members").delete().eq("club_id", clubId).eq("user_id", u.id);
  if (r.error) throw r.error;
  revalidatePath(`/klublar/${slug}`);
}
