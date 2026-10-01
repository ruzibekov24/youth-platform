import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { LOGIN_COOKIE } from "@/lib/login-token";
import { t } from "@/lib/strings.uz";
import { LoginPoller } from "./poller";

export const metadata: Metadata = { title: `${t.auth.waitingTitle} · ${t.brand}` };

export default async function WaitingPage() {
  const token = (await cookies()).get(LOGIN_COOKIE)?.value;
  const bot = process.env.TELEGRAM_BOT_USERNAME;
  if (!token || !bot) redirect("/kirish");

  return (
    <main className="flex-1 py-16">
      <Container className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">{t.auth.waitingTitle}</h1>
        <p className="mt-3 text-muted">{t.auth.waitingText}</p>
        <div className="mt-8">
          <ButtonLink href={`https://t.me/${bot}?start=${token}`} external>
            {t.auth.openBot}
          </ButtonLink>
        </div>
        <LoginPoller />
      </Container>
    </main>
  );
}
