import Image from "next/image";
import Link from "next/link";
import { TelegramBridge } from "@/components/telegram/bridge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getCurrentUser } from "@/lib/auth";
import { t } from "@/lib/strings.uz";
import { AppNav } from "./nav";
import "@/components/cards/cards.css";
import "./app.css";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-in">
          <Link href="/asosiy" className="brand" aria-label={t.brand}>
            <Image src="/brand/logo.svg" alt={t.brand} width={90} height={24} className="lg-l" priority />
            <Image src="/brand/logo-white.svg" alt="" width={90} height={24} className="lg-d" aria-hidden />
          </Link>
          <AppNav variant="top" />
          <div className="topbar-r">
            <ThemeToggle />
            {user ? (
              <Link href="/profil" className="avatar" aria-label={t.app.profileLink}>
                {(user.first_name ?? "?")[0]}
              </Link>
            ) : (
              <Link href="/kirish" className="btn blk">
                {t.nav.login}
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="page">{children}</main>
      <AppNav variant="tabs" />
      <TelegramBridge />
    </div>
  );
}
