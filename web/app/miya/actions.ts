"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { sendTelegram } from "@/lib/bot";
import { db } from "@/lib/db";
import { trackEvent } from "@/lib/events";
import { MAX_PENDING_IDEAS, validateIdea } from "@/lib/idea-validate";
import { getTelegramId, groupOfUser } from "@/lib/ideas";
import { allow } from "@/lib/rate-limit";
import { ROLES, t } from "@/lib/strings.uz";
import { ageGroupOf, cleanText, isAgeRange } from "@/lib/validate";

export type FormState = { status: "idle" | "ok" | "error"; message?: string };

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

async function notify(userId: string, text: string, html = false) {
  try {
    const tg = await getTelegramId(userId);
    if (tg) await sendTelegram(tg, text, html);
  } catch {
    // Bot bloklangan boʻlishi mumkin: asosiy amal buzilmaydi.
  }
}

export async function createIdea(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/kirish?next=/miya/yangi");
  const f = t.miya.form;

  if (!(await allow(`idea:${user.id}`, 3600, 5))) return { status: "error", message: f.errorRate };

  const input = validateIdea(
    {
      title: String(formData.get("title") ?? ""),
      problem: String(formData.get("problem") ?? ""),
      description: String(formData.get("description") ?? ""),
      roles: formData.getAll("roles").map(String),
    },
    ROLES,
  );
  if (!input) return { status: "error", message: f.errorLength };

  const pending = await db()
    .from("ideas")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("status", "pending");
  if (pending.error) throw pending.error;
  if ((pending.count ?? 0) >= MAX_PENDING_IDEAS) return { status: "error", message: f.errorLimit };

  const ins = await db()
    .from("ideas")
    .insert({ ...input, owner_id: user.id, age_group: groupOfUser(user) })
    .select("id")
    .single();
  if (ins.error) throw ins.error;
  await trackEvent(user.id, "idea_create", "idea", ins.data.id);
  return { status: "ok" };
}

export async function requestJoin(ideaId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect(`/kirish?next=/miya/${ideaId}`);
  const j = t.miya.join;

  if (!(await allow(`join:${user.id}`, 3600, 10))) return { status: "error", message: t.miya.form.errorRate };

  const idea = await db().from("ideas").select("id, title, owner_id, status, age_group, needed_roles").eq("id", ideaId).maybeSingle();
  if (idea.error) throw idea.error;
  const i = idea.data;
  if (!i || i.status !== "open") return { status: "error", message: t.miya.closedNote };
  if (i.owner_id === user.id) return { status: "error", message: j.own };
  // Yosh guruhi qoidasi: 18 yoshgacha va 18+ bogʻlanmaydi.
  if (i.age_group !== groupOfUser(user)) return { status: "error", message: j.sameGroupOnly };

  const role = String(formData.get("role") ?? "");
  const message = cleanText(String(formData.get("message") ?? ""), 500);
  if (!role || ![...(i.needed_roles as string[]), "Boshqa"].includes(role) || !message) {
    return { status: "error", message: t.miya.form.errorLength };
  }

  const ins = await db().from("join_requests").insert({ idea_id: ideaId, user_id: user.id, role, message });
  if (ins.error) {
    if (ins.error.code === "23505") return { status: "ok" }; // allaqachon yuborilgan
    throw ins.error;
  }
  await trackEvent(user.id, "join_request", "idea", ideaId);
  await notify(i.owner_id, t.bot.newRequest(i.title));
  revalidatePath(`/miya/${ideaId}`);
  return { status: "ok" };
}

export async function decideRequest(requestId: string, decision: "accepted" | "declined") {
  const user = await getCurrentUser();
  if (!user) redirect("/kirish");

  const r = await db()
    .from("join_requests")
    .select("id, idea_id, user_id, status, ideas(id, title, owner_id, age_group), users(first_name, age_range)")
    .eq("id", requestId)
    .maybeSingle();
  if (r.error) throw r.error;
  const row = r.data as unknown as {
    id: string; idea_id: string; user_id: string; status: string;
    ideas: { id: string; title: string; owner_id: string; age_group: "under18" | "adult" };
    users: { first_name: string | null; age_range: string | null };
  } | null;
  if (!row || row.ideas.owner_id !== user.id || row.status !== "pending") return;

  // Qabul qilishdan oldin yosh guruhini yana tekshiramiz.
  if (decision === "accepted") {
    const ar = row.users.age_range;
    if (!isAgeRange(ar) || ageGroupOf(ar) !== row.ideas.age_group) return;
  }

  const up = await db().from("join_requests").update({ status: decision }).eq("id", requestId).eq("status", "pending");
  if (up.error) throw up.error;

  if (decision === "accepted") {
    await trackEvent(user.id, "join_accepted", "idea", row.idea_id);
    // Aloqa faqat oʻzaro qabuldan keyin va faqat bot orqali, ikkala tomonga.
    const [ownerTg, memberTg] = await Promise.all([getTelegramId(user.id), getTelegramId(row.user_id)]);
    const link = (tg: number | null, name: string | null) =>
      tg ? `<a href="tg://user?id=${tg}">${escapeHtml(name ?? "…")}</a>` : escapeHtml(name ?? "…");
    await notify(row.user_id, t.bot.accepted(row.ideas.title, link(ownerTg, user.first_name)), true);
    await notify(user.id, t.bot.accepted(row.ideas.title, link(memberTg, row.users.first_name)), true);
  }
  revalidatePath(`/miya/${row.idea_id}`);
}

export async function closeIdea(ideaId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/kirish");
  const r = await db().from("ideas").update({ status: "closed" }).eq("id", ideaId).eq("owner_id", user.id);
  if (r.error) throw r.error;
  revalidatePath(`/miya/${ideaId}`);
  revalidatePath("/miya");
}
