import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConfigured } from "./db";
import { SESSION_COOKIE, verifySession } from "./session";
import { getUserById, type UserRow } from "./users";

// Hozirgi kirgan foydalanuvchi (savollarni tugatgan boʻlsa), aks holda null.
export const getCurrentUser = cache(async (): Promise<UserRow | null> => {
  if (!dbConfigured() || !process.env.SESSION_SECRET) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = await verifySession(token);
  if (!userId) return null;
  const user = await getUserById(userId);
  return user && user.onboarding_step === null ? user : null;
});

export async function requireUser(): Promise<UserRow> {
  const user = await getCurrentUser();
  if (!user) redirect("/kirish");
  return user;
}
