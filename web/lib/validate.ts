import type { AgeRange } from "./types.ts";

export const AGE_RANGES: AgeRange[] = ["13-15", "16-17", "18-25"];

export function isAgeRange(v: unknown): v is AgeRange {
  return typeof v === "string" && (AGE_RANGES as string[]).includes(v);
}

// 18 yoshgacha va 18+ bir-biri bilan bogʻlanmaydi (CLAUDE.md).
export function ageGroupOf(range: AgeRange): "under18" | "adult" {
  return range === "18-25" ? "adult" : "under18";
}

// Ism/laqab: faqat harflar, boʻshliq, apostrof, defis, nuqta. Havola, @ va telefon raqami rad etiladi.
export function sanitizeName(input: string): string | null {
  const cleaned = input
    .normalize("NFC")
    .replace(/[\p{Cc}\p{Cf}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length < 1 || cleaned.length > 40) return null;
  if (!/^[\p{L}\p{M}][\p{L}\p{M} '’ʻʼ.\-]*$/u.test(cleaned)) return null;
  if (/t\.me|http|www\./i.test(cleaned)) return null;
  return cleaned;
}

// Erkin matn (gʻoya, xabar): boshqaruv belgilarini olib tashlaydi, uzunlikni chekaydi.
export function cleanText(input: string, max: number): string {
  return input
    .normalize("NFC")
    .replace(/[\p{Cc}\p{Cf}]/gu, (c) => (c === "\n" ? "\n" : ""))
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}
