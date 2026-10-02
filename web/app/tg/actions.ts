"use server";

import { cookies } from "next/headers";
import { trackEvent } from "@/lib/events";
import { clientKey } from "@/lib/ip";
import { allow } from "@/lib/rate-limit";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import { verifyInitData } from "@/lib/telegram-webapp";
import { getUserByTelegramId } from "@/lib/users";

export type TgLoginResult = "ok" | "register" | "error";

// Mini App ichidan kirish: Telegram imzolagan initData tekshiriladi, keyin sessiya ochiladi.
export async function tgLogin(initData: string): Promise<TgLoginResult> {
  if (typeof initData !== "string") return "error";
  if (!(await allow(`tglogin:${await clientKey()}`, 600, 30))) return "error";
  const v = verifyInitData(initData, process.env.TELEGRAM_BOT_TOKEN ?? "");
  if (!v) return "error";

  // Akkaunt faqat bot anketasi orqali yaratiladi (ism, yosh oralig'i, hudud, qiziqishlar).
  const user = await getUserByTelegramId(v.telegramId);
  if (!user || user.onboarding_step !== null) return "register";

  const prod = process.env.NODE_ENV === "production";
  // Telegram Desktop/Web Mini App'ni iframe'da ochadi: u yerda cookie faqat SameSite=None + Partitioned bilan ishlaydi.
  (await cookies()).set(SESSION_COOKIE, await signSession(user.id), {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? "none" : "lax",
    partitioned: prod,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  await trackEvent(user.id, "login_miniapp");
  return "ok";
}
