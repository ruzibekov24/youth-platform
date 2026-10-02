import type { Metadata } from "next";
import { LoginFrame } from "@/components/app/login-frame";
import { t } from "@/lib/strings.uz";
import { MiniAppEntry } from "./entry";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: t.brand, robots: { index: false } };

// Telegram Mini App kirish nuqtasi: bot menyusidagi "Ochish" tugmasi shu sahifani ochadi.
export default function MiniAppPage() {
  return (
    <LoginFrame>
      <MiniAppEntry bot={process.env.TELEGRAM_BOT_USERNAME ?? ""} />
    </LoginFrame>
  );
}
