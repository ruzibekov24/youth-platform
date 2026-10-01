import { createHash, randomBytes } from "node:crypto";

export const LOGIN_TTL_MS = 10 * 60 * 1000;
export const LOGIN_COOKIE = "yb_login";

// 24 bayt = 32 belgi (base64url): Telegram deep link payload chegarasiga (64) sigʻadi.
export function newLoginToken(): string {
  return randomBytes(24).toString("base64url");
}

// Bazada faqat hash saqlanadi.
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isWellFormedToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{32}$/.test(token);
}
