import "server-only";
import { db } from "./db";
import { retention } from "./cycle";
import { formatDay } from "./format";
import { t } from "./strings.uz";

// Pilot o'lchovi: har bir haqiqiy klub uchun a'zolar, sessiyadagi qatnashchilar soni va qolish foizi.
// Faqat sonlar: foydalanuvchi ID yoki Telegram ID chiqmaydi.
export async function clubStatsText(): Promise<string> {
  const S = t.mod.stats;
  const clubs = await db()
    .from("clubs")
    .select("id, name, seats")
    .eq("is_active", true)
    .eq("is_sample", false)
    .order("name");
  if (clubs.error) throw clubs.error;
  if (!clubs.data?.length) return S.empty;

  const ids = clubs.data.map((c) => c.id as string);
  const [members, sessions] = await Promise.all([
    db().from("club_members").select("club_id").in("club_id", ids),
    db()
      .from("club_sessions")
      .select("id, club_id, starts_at, kind")
      .in("club_id", ids)
      .lt("starts_at", new Date().toISOString())
      .order("starts_at"),
  ]);
  if (members.error) throw members.error;
  if (sessions.error) throw sessions.error;

  const sessionIds = (sessions.data ?? []).map((s) => s.id as string);
  const attendance = sessionIds.length
    ? await db().from("club_attendance").select("session_id").in("session_id", sessionIds)
    : { data: [] as { session_id: string }[], error: null };
  if (attendance.error) throw attendance.error;
  const perSession = new Map<string, number>();
  for (const a of attendance.data ?? []) perSession.set(a.session_id, (perSession.get(a.session_id) ?? 0) + 1);

  return clubs.data
    .map((c) => {
      const mine = (sessions.data ?? []).filter((s) => s.club_id === c.id);
      const memberCount = (members.data ?? []).filter((m) => m.club_id === c.id).length;
      const lines = [S.club(c.name as string, memberCount, (c.seats as number | null) ?? null)];
      if (!mine.length) lines.push(S.noSessions);
      const counts = mine.map((s) => perSession.get(s.id as string) ?? 0);
      mine.forEach((s, i) => lines.push(S.session(i + 1, formatDay(s.starts_at as string), counts[i], s.kind === "demo")));
      const kept = retention(counts);
      if (kept !== null) lines.push(S.retention(kept));
      return lines.join("\n");
    })
    .join("\n\n");
}
