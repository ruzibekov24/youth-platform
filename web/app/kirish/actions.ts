"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { consumeToken, createLoginToken, getLoginStatus, type LoginStatus } from "@/lib/login";
import { LOGIN_COOKIE, LOGIN_TTL_MS } from "@/lib/login-token";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";

const secure = process.env.NODE_ENV === "production";

export async function startLogin() {
  const token = await createLoginToken();
  (await cookies()).set(LOGIN_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: LOGIN_TTL_MS / 1000,
  });
  redirect("/kirish/kutish");
}

export async function checkLogin(): Promise<LoginStatus> {
  const token = (await cookies()).get(LOGIN_COOKIE)?.value;
  return token ? getLoginStatus(token) : "expired";
}

export async function completeLogin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(LOGIN_COOKIE)?.value;
  if (!token) return false;
  const userId = await consumeToken(token);
  if (!userId) return false;
  jar.set(SESSION_COOKIE, await signSession(userId), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  jar.delete(LOGIN_COOKIE);
  return true;
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
