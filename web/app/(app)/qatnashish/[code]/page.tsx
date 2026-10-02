import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { Tile } from "@/components/ui/tile";
import { getCurrentUser } from "@/lib/auth";
import { checkinOpen } from "@/lib/checkin";
import { getSessionByCode } from "@/lib/clubs";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { t } from "@/lib/strings.uz";
import { checkIn } from "./actions";

export const metadata: Metadata = { title: `${t.club.checkin.title} · ${t.brand}`, robots: { index: false } };

// Sessiyada QR skanerlanganda ochiladi: qatnashish faqat sessiya vaqtida yoziladi.
export default async function CheckinPage(props: PageProps<"/qatnashish/[code]">) {
  const { code } = await props.params;
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
    <div className="pnl empty" style={{ maxWidth: 520, margin: "24px auto 0" }}>
      <Tile name={attended ? "check" : "qr"} size={72} className="tile-lg" />
      <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)", marginTop: 12 }}>{k.title}</h1>
      {!session ? (
        <p className="err">{k.invalid}</p>
      ) : (
        <>
          <p>
            <b>{session.clubs.name}</b> · {session.topic}
            <br />
            {formatDateTime(session.starts_at)}
          </p>
          <div style={{ marginTop: 12, width: "100%" }}>
            {!user ? (
              <>
                <p>{k.loginPrompt}</p>
                <Link href={`/kirish?next=/qatnashish/${code}`} className="btn w" style={{ marginTop: 12 }}>
                  {t.nav.login}
                </Link>
              </>
            ) : attended ? (
              <>
                <p className="ok-note meta" role="status" style={{ justifyContent: "center" }}>
                  <span>
                    <CheckIcon /> {k.done}
                  </span>
                </p>
                <Link href="/profil" className="btn ghost w" style={{ marginTop: 12 }}>
                  {k.toProfile}
                </Link>
              </>
            ) : !checkinOpen(session.starts_at) ? (
              <p className="ok-note">{k.closed}</p>
            ) : (
              <form action={checkIn.bind(null, code)}>
                <button type="submit" className="btn w">
                  {k.confirm}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
