import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { me } from "@/lib/sample-data";
import { t } from "@/lib/strings.uz";
import { AppNav } from "./nav";
import "@/components/cards/cards.css";
import "./app.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-in">
          <Link href="/bugun" className="brand" aria-label={t.brand}>
            <Image src="/brand/logo.svg" alt={t.brand} width={90} height={24} className="lg-l" priority />
            <Image src="/brand/logo-white.svg" alt="" width={90} height={24} className="lg-d" aria-hidden />
          </Link>
          <AppNav variant="top" />
          <div className="topbar-r">
            <ThemeToggle />
            <Link href="/profil" className="avatar" aria-label={t.app.profileLink}>
              {me.name[0]}
            </Link>
          </div>
        </div>
      </header>
      <main className="page">{children}</main>
      <AppNav variant="tabs" />
    </div>
  );
}
