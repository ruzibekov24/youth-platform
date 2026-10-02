import { timingSafeEqual } from "node:crypto";
import { handleUpdate } from "@/lib/bot";

export const dynamic = "force-dynamic";

function secretMatches(given: string | null, expected: string): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return new Response("Not configured", { status: 503 });
  // Begona soʻrovlar botga yetmasdan shu yerda toʻxtatiladi.
  if (!secretMatches(req.headers.get("x-telegram-bot-api-secret-token"), expected)) {
    return new Response("Unauthorized", { status: 401 });
  }
  return handleUpdate(req);
}
