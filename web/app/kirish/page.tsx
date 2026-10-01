import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { t } from "@/lib/strings.uz";
import { startLogin } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.auth.title} · ${t.brand}` };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  const ready =
    dbConfigured() && Boolean(process.env.TELEGRAM_BOT_USERNAME && process.env.SESSION_SECRET);

  return (
    <main className="flex-1 py-16">
      <Container className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">{t.auth.title}</h1>
        <p className="mt-3 text-muted">{t.auth.lead}</p>
        {ready ? (
          <form action={startLogin} className="mt-8">
            <Button type="submit" className="w-full sm:w-auto">
              {t.auth.start}
            </Button>
          </form>
        ) : (
          <p className="mt-8 rounded-xl bg-warn-soft px-4 py-3 text-sm text-warn">
            {t.auth.notConfigured}
          </p>
        )}
      </Container>
    </main>
  );
}
