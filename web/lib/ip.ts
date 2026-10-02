import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

// Xom IP bazaga yozilmaydi: rate limit kaliti sifatida hash saqlanadi.
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}
