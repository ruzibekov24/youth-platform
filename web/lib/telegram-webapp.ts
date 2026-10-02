import { createHmac, timingSafeEqual } from "node:crypto";

// Telegram Mini App initData tekshiruvi (core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).
// Imzo bot tokeni bilan tekshiriladi; to'g'ri bo'lsa faqat Telegram ID qaytariladi (ism/rasm saqlanmaydi).
export const INIT_DATA_MAX_AGE_S = 24 * 60 * 60;

export function verifyInitData(
  initData: string,
  botToken: string,
  nowS = Math.floor(Date.now() / 1000),
): { telegramId: number } | null {
  if (!initData || initData.length > 4096 || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash || !/^[0-9a-f]{64}$/.test(hash)) return null;
  params.delete("hash");

  const check = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = createHmac("sha256", secret).update(check).digest();
  const given = Buffer.from(hash, "hex");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate) || nowS - authDate > INIT_DATA_MAX_AGE_S || authDate - nowS > 60) return null;

  try {
    const user = JSON.parse(params.get("user") ?? "null") as { id?: unknown } | null;
    const id = Number(user?.id);
    return Number.isSafeInteger(id) && id > 0 ? { telegramId: id } : null;
  } catch {
    return null;
  }
}
