"use server";

import { notifyNewReport } from "@/lib/bot";
import { db } from "@/lib/db";
import { clientKey } from "@/lib/ip";
import { allow } from "@/lib/rate-limit";
import { cleanText, isUuid } from "@/lib/validate";

const ENTITY_TYPES = ["opportunity", "club", "idea"] as const;
type EntityType = (typeof ENTITY_TYPES)[number];

export type ReportState = "idle" | "ok" | "error";

export async function reportEntity(
  entityType: EntityType,
  entityId: string,
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const reason = cleanText(String(formData.get("reason") ?? ""), 500);
  if (!ENTITY_TYPES.includes(entityType) || !isUuid(entityId) || !reason) {
    return "error";
  }
  if (!(await allow(`report:${await clientKey()}`, 3600, 5))) return "error";
  const r = await db().from("reports").insert({ entity_type: entityType, entity_id: entityId, reason }).select("id").single();
  if (r.error) return "error";
  // Moderatorlarga darhol bot orqali (yashirish / ko'rib chiqildi tugmalari bilan).
  await notifyNewReport(r.data.id).catch(() => {});
  return "ok";
}
