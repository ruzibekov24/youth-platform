import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LockIcon, TelegramMark } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Tile } from "@/components/ui/tile";
import { t } from "@/lib/strings.uz";
import "@/components/app/app.css";

export const metadata: Metadata = { title: `${t.app.login.title} · ${t.brand}` };

// Kirish faqat Telegram bot orqali. Login token va deep link M4 bosqichida qo'shiladi.
export default function LoginPage() {
  const c = t.app.login;
  const bot = process.env.TELEGRAM_BOT_USERNAME;
  const link = bot ? `https://t.me/${bot}?start=login` : null;

  return (
    <main className="login">
      <div className="login-top">
        <Link href="/" className="brand" aria-label={c.home}>
          <Image src="/brand/logo.svg" alt={t.brand} width={90} height={24} className="lg-l" />
          <Image src="/brand/logo-white.svg" alt="" width={90} height={24} className="lg-d" aria-hidden />
        </Link>
        <ThemeToggle />
      </div>

      <div className="login-card">
        <Tile name="key" size={84} className="tile-lg" />
        <h1>{c.title}</h1>
        <p className="ph-lead">{c.lead}</p>

        {link ? (
          <a href={link} className="btn w big" rel="noopener noreferrer">
            <TelegramMark mono className="tgm-btn" /> {c.cta}
          </a>
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
      </div>
    </main>
  );
}
