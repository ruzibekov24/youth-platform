const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000; // UTC+5, yozgi vaqt yoʻq

// Toshkent boʻyicha bugungi kun tugashi (ertangi 00:00).
export function tashkentDayEnd(now: Date): Date {
  const local = new Date(now.getTime() + TASHKENT_OFFSET_MS);
  const nextMidnightLocal = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate() + 1,
  );
  return new Date(nextMidnightLocal - TASHKENT_OFFSET_MS);
}
