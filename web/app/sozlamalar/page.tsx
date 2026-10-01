import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireUser } from "@/lib/auth";
import { t } from "@/lib/strings.uz";
import { deleteAccount, toggleReminders } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.settings.title} · ${t.brand}` };

export default async function SettingsPage() {
  const user = await requireUser();
  const s = t.settings;

  return (
    <main className="flex-1 py-12">
      <Container className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">{s.title}</h1>

        <Card className="mt-8">
          <h2 className="font-semibold">{s.reminders}</h2>
          <p className="mt-1 text-sm text-muted">
            {user.reminders_enabled ? s.remindersOn : s.remindersOff}
          </p>
          <form action={toggleReminders} className="mt-4">
            <Button type="submit" variant="secondary">
              {s.toggleReminders}
            </Button>
          </form>
        </Card>

        <Card className="mt-6 border-danger/30">
          <h2 className="font-semibold">{s.dangerTitle}</h2>
          <p className="mt-1 text-sm text-muted">{s.dangerText}</p>
          <form action={deleteAccount} className="mt-4 space-y-4">
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input type="checkbox" name="confirm" value="yes" required className="size-5" />
              {s.confirmLabel}
            </label>
            <Button type="submit" variant="danger">
              {s.delete}
            </Button>
          </form>
        </Card>
      </Container>
    </main>
  );
}
