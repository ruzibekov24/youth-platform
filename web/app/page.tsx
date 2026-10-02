import { redirect } from "next/navigation";
import { Landing } from "@/components/landing/landing";
import { getCurrentUser } from "@/lib/auth";

// Mehmon landingni ko'radi; kirgan foydalanuvchi to'g'ridan-to'g'ri Asosiy ekranga o'tadi.
export default async function Home() {
  if (await getCurrentUser()) redirect("/asosiy");
  return <Landing />;
}
