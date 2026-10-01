import "server-only";
import { db } from "./db";

// Eskirgan rate limit hisoblagichlari va login tokenlarini tozalaydi.
export async function cleanup(): Promise<void> {
  const day = new Date(Date.now() - 86_400_000).toISOString();
  await db().from("rate_limits").delete().lt("window_start", day);
  await db().from("login_tokens").delete().lt("expires_at", day);
}
