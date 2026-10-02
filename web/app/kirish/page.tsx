import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LockIcon, TelegramMark } from "@/components/icons";
import { LoginFrame } from "@/components/app/login-frame";
import { Tile } from "@/components/ui/tile";
import { getCurrentUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { safeNextPath } from "@/lib/next-path";
import { t } from "@/lib/strings.uz";
import { startLogin } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${t.app.login.title} · ${t.brand}` };

// Kirish faqat Telegram bot orqali: sayt bir martalik token yaratadi, bot tasdiqlaydi.
export default async function LoginPage(props: PageProps<"/kirish">) {
  const c = t.app.login;
  const next = safeNextPath((await props.searchParams).next);
  if (await getCurrentUser()) redirect(next === "/" ? "/bugun" : next);
  const ready = dbConfigured() && Boolean(process.env.TELEGRAM_BOT_USERNAME && process.env.SESSION_SECRET);

  return (
    <LoginFrame>
      <Tile name="key" size={84} className="tile-lg" />
      <h1>{c.title}</h1>
      <p className="ph-lead">{c.lead}</p>

      {ready ? (
        <form action={startLogin}>
          <input type="hidden" name="next" value={next === "/" ? "/bugun" : next} />
          <button type="submit" className="btn w big">
            <TelegramMark mono className="tgm-btn" /> {c.cta}
          </button>
        </form>
      ) : (
        <>
          <span className="btn w big" aria-disabled="true">
            <TelegramMark mono className="tgm-btn" /> {c.cta}
          </span>
          <p className="login-note">{c.noBot}</p>
        </>
      )}

      <ol className="steps-l">
        {c.steps.map((s, i) => (
          <li key={s.title}>
            <span className="n">{i + 1}</span>
            <div>
              <b>{s.title}</b>
              <span>{s.text}</span>
            </div>
          </li>
        ))}
      </ol>

      <p className="login-note">
        <LockIcon /> {c.never}
      </p>
    </LoginFrame>
  );
}
