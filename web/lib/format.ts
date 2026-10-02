const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr",
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()}-${MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const tz = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  });
  return `${formatDate(iso)}, ${tz}`;
}

export function isClosed(closesAt: string | null, now = new Date()): boolean {
  return closesAt !== null && new Date(closesAt).getTime() < now.getTime();
}

export function daysLeft(closesAt: string, now = new Date()): number {
  return Math.ceil((new Date(closesAt).getTime() - now.getTime()) / 86_400_000);
}

export function ageLabel(min: number | null, max: number | null): string {
  if (min && max) return `${min}–${max} yosh`;
  if (min) return `${min}+ yosh`;
  if (max) return `${max} yoshgacha`;
  return "Yosh chegarasi yoʻq";
}

const TZ = "Asia/Tashkent";

// Qisqa sana, Toshkent vaqti bilan: "4-oktyabr".
export function formatDay(iso: string): string {
  const d = new Date(iso);
  const day = Number(d.toLocaleString("en-GB", { day: "numeric", timeZone: TZ }));
  const month = Number(d.toLocaleString("en-GB", { month: "numeric", timeZone: TZ }));
  return `${day}-${MONTHS[month - 1]}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
}

export function isSameTashkentDay(iso: string, now = new Date()): boolean {
  const f = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });
  return f(new Date(iso)) === f(now);
}
