import "server-only";
import { db } from "./db";

// Qaytaradi true = ruxsat. Hisoblagich bazada (rate_hit funksiyasi), shuning uchun serverless'da ham ishlaydi.
// Xatolikda rad etadi (fail-closed).
export async function allow(key: string, windowSeconds: number, limit: number): Promise<boolean> {
  const r = await db().rpc("rate_hit", { p_key: key, p_window_seconds: windowSeconds, p_limit: limit });
  if (r.error) return false;
  return r.data === true;
}
