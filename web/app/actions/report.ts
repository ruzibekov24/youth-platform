"use server";

import { db } from "@/lib/db";
import { cleanText } from "@/lib/validate";

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
  if (!ENTITY_TYPES.includes(entityType) || !/^[0-9a-f-]{36}$/i.test(entityId) || !reason) {
    return "error";
  }
  const r = await db().from("reports").insert({ entity_type: entityType, entity_id: entityId, reason });
  return r.error ? "error" : "ok";
}
