import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth";
import { checkinOpen } from "@/lib/checkin";
import { getSessionByCode } from "@/lib/clubs";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { t } from "@/lib/strings.uz";
import { checkIn } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.club.checkin.title} · ${t.brand}`, robots: { index: false } };

export default async function CheckinPage({ params }: PageProps<"/qatnashish/[code]">) {
  const { code } = await params;
  const k = t.club.checkin;
  const session = await getSessionByCode(code);
  const user = await getCurrentUser();

  let attended = false;
  if (session && user) {
    const r = await db()
      .from("club_attendance")
      .select("session_id")
      .eq("session_id", session.id)
      .eq("user_id", user.id)
      .maybeSingle();
    attended = Boolean(r.data);
  }

  return (
    <main className="flex-1 py-16">
      <Container className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight">{k.title}</h1>
        {!session ? (
          <p className="mt-4 text-danger">{k.invalid}</p>
        ) : (
          <>
            <p className="mt-3 text-lg">{session.clubs.name}</p>
            <p className="text-muted">
              {session.topic} · {formatDateTime(session.starts_at)}
            </p>
            <div className="mt-8">
              {!user ? (
                <>
                  <p className="mb-4 text-muted">{k.loginPrompt}</p>
                  <ButtonLink href={`/kirish?next=/qatnashish/${code}`}>{t.nav.login}</ButtonLink>
                </>
              ) : attended ? (
                <>
                  <p className="mb-4 font-medium text-ok" role="status">
                    {k.done}
                  </p>
                  <ButtonLink href="/profil" variant="secondary">
                    {k.toProfile}
                  </ButtonLink>
                </>
              ) : !checkinOpen(session.starts_at) ? (
                <p className="text-muted">{k.closed}</p>
              ) : (
                <form action={checkIn.bind(null, code)}>
                  <Button type="submit">{k.confirm}</Button>
                </form>
              )}
            </div>
          </>
        )}
      </Container>
    </main>
  );
}
