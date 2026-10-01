"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { checkinOpen } from "@/lib/checkin";
import { getSessionByCode } from "@/lib/clubs";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/events";

export async function checkIn(code: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/kirish?next=/qatnashish/${code}`);
  const session = await getSessionByCode(code);
  if (!session || !checkinOpen(session.starts_at)) redirect(`/qatnashish/${code}`);

  const att = await db()
    .from("club_attendance")
    .upsert({ session_id: session.id, user_id: user.id }, { onConflict: "session_id,user_id", ignoreDuplicates: true });
  if (att.error) throw att.error;
  // Qatnashgan odam klub aʼzosi hamdir.
  const mem = await db()
    .from("club_members")
    .upsert({ club_id: session.club_id, user_id: user.id }, { onConflict: "club_id,user_id", ignoreDuplicates: true });
  if (mem.error) throw mem.error;

  await trackEvent(user.id, "club_checkin", "club_session", session.id);
  redirect(`/qatnashish/${code}`);
}
