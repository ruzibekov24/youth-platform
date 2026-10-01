// QR check-in oynasi: boshlanishidan 30 daqiqa oldin, 4 soat keyin gacha.
// Kod keyinroq ulashilsa ham qatnashgan deb yozilmaydi.
export const CHECKIN_BEFORE_MS = 30 * 60 * 1000;
export const CHECKIN_AFTER_MS = 4 * 60 * 60 * 1000;

export function checkinOpen(startsAt: string, now = new Date()): boolean {
  const start = new Date(startsAt).getTime();
  return now.getTime() >= start - CHECKIN_BEFORE_MS && now.getTime() <= start + CHECKIN_AFTER_MS;
}
