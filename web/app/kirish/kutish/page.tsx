import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginFrame } from "@/components/app/login-frame";
import { TelegramMark } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { LOGIN_COOKIE } from "@/lib/login-token";
import { t } from "@/lib/strings.uz";
import { LoginPoller } from "./poller";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.app.login.waitTitle} · ${t.brand}` };

export default async function WaitingPage() {
  const c = t.app.login;
  const token = (await cookies()).get(LOGIN_COOKIE)?.value;
  const bot = process.env.TELEGRAM_BOT_USERNAME;
  if (!token || !bot) redirect("/kirish");

  return (
    <LoginFrame>
      <Tile name="key" size={84} className="tile-lg" />
      <h1>{c.waitTitle}</h1>
      <p className="ph-lead">{c.waitText}</p>
      <a href={`https://t.me/${bot}?start=${token}`} target="_blank" rel="noopener noreferrer" className="btn w big">
        <TelegramMark mono className="tgm-btn" /> {c.openBot}
      </a>
      <LoginPoller />
    </LoginFrame>
  );
}
