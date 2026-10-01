"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { consumeToken, createLoginToken, getLoginStatus, type LoginStatus } from "@/lib/login";
import { LOGIN_COOKIE, LOGIN_TTL_MS } from "@/lib/login-token";
import { NEXT_COOKIE, safeNextPath } from "@/lib/next-path";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";

const secure = process.env.NODE_ENV === "production";

export async function startLogin(formData: FormData) {
  const token = await createLoginToken();
  const jar = await cookies();
  const opts = { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: LOGIN_TTL_MS / 1000 } as const;
  jar.set(LOGIN_COOKIE, token, opts);
  jar.set(NEXT_COOKIE, safeNextPath(formData.get("next")), opts);
  redirect("/kirish/kutish");
}

export async function checkLogin(): Promise<LoginStatus> {
  const token = (await cookies()).get(LOGIN_COOKIE)?.value;
  return token ? getLoginStatus(token) : "expired";
}

export async function completeLogin(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(LOGIN_COOKIE)?.value;
  if (!token) return null;
  const userId = await consumeToken(token);
  if (!userId) return null;
  jar.set(SESSION_COOKIE, await signSession(userId), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  const next = safeNextPath(jar.get(NEXT_COOKIE)?.value);
  jar.delete(LOGIN_COOKIE);
  jar.delete(NEXT_COOKIE);
  return next;
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
