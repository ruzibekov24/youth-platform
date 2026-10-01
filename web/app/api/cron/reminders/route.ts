import { timingSafeEqual } from "node:crypto";
import { sendSessionReminders } from "@/lib/reminders";

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const given = req.headers.get("authorization");
  if (!secret || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Vercel Cron kuniga bir marta chaqiradi (vercel.json), CRON_SECRET bilan.
export async function GET(req: Request) {
  if (!authorized(req)) return new Response("Unauthorized", { status: 401 });
  const sessions = await sendSessionReminders();
  return Response.json({ sessions });
}
