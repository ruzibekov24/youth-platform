"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/session";
import { deleteUser, updateUser } from "@/lib/users";

export async function toggleReminders() {
  const user = await getCurrentUser();
  if (!user) redirect("/kirish");
  await updateUser(user.id, { reminders_enabled: !user.reminders_enabled });
  revalidatePath("/sozlamalar");
}

export async function deleteAccount(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/kirish");
  if (formData.get("confirm") !== "yes") return;
  await deleteUser(user.id);
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
