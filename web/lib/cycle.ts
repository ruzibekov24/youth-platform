import type { AgeRange } from "./types";

// Klub tsikli qoidalari (sof funksiyalar, bazasiz): o'rinlar, boshlanish holati, hafta, yosh guruhi.
export type ClubGroup = "under18" | "adult" | null;

export const seatsLeft = (seats: number | null, members: number): number | null =>
  seats === null ? null : Math.max(0, seats - members);

// Boshlanishi uchun yana nechta odam kerak (0 = yetarli).
export const neededToStart = (minToStart: number, members: number): number => Math.max(0, minToStart - members);

export type CycleState = "none" | "needs" | "ready" | "running" | "full";

export function cycleState(
  c: { seats: number | null; min_to_start: number; starts_on: string | null; cycle_weeks: number | null },
  members: number,
  now = new Date(),
): CycleState {
  if (!c.starts_on || !c.cycle_weeks) return "none";
  if (seatsLeft(c.seats, members) === 0) return "full";
  if (now.getTime() >= startMs(c.starts_on)) return "running";
  return neededToStart(c.min_to_start, members) > 0 ? "needs" : "ready";
}

// Toshkent yarim kechasidan boshlanadi (UTC+5).
const startMs = (startsOn: string) => new Date(`${startsOn}T00:00:00+05:00`).getTime();

// Hozir tsiklning nechanchi haftasi: 0 = hali boshlanmagan, 1..weeks, weeks+1 = tugagan.
export function weekOf(startsOn: string, weeks: number, now = new Date()): number {
  const days = Math.floor((now.getTime() - startMs(startsOn)) / 86_400_000);
  if (days < 0) return 0;
  return Math.min(weeks + 1, Math.floor(days / 7) + 1);
}

// Qolish foizi: oxirgi sessiyadagi qatnashchilar / birinchisidagilar. Kamida 2 sessiya va birinchisida odam bo'lishi kerak.
export function retention(counts: number[]): number | null {
  if (counts.length < 2 || counts[0] === 0) return null;
  return Math.round((counts[counts.length - 1] / counts[0]) * 100);
}

// 13-17 faqat "under18" klubga, 18-25 faqat "adult" klubga. Guruhi yo'q klub hammaga ochiq.
export function ageAllowed(group: ClubGroup, age: AgeRange | null): boolean {
  if (!group) return true;
  if (!age) return false;
  return (age === "18-25" ? "adult" : "under18") === group;
}
