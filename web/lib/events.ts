import "server-only";
import { db } from "./db";

// Analitika. Yozishdagi xato foydalanuvchi amaliyotini buzmasligi kerak.
export async function trackEvent(
  userId: string | null,
  type: string,
  entityType?: string,
  entityId?: string,
): Promise<void> {
  try {
    await db().from("events").insert({
      user_id: userId,
      type,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
    });
  } catch {
    // eʼtiborsiz
  }
}
