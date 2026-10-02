import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { t } from "@/lib/strings.uz";
import "./app.css";

// Kirish va kutish sahifalari uchun umumiy ramka (shell'siz).
export function LoginFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="login">
      <div className="login-top">
        <Link href="/" className="brand" aria-label={t.app.login.home}>
          <Image src="/brand/logo.svg" alt={t.brand} width={90} height={24} className="lg-l" />
          <Image src="/brand/logo-white.svg" alt="" width={90} height={24} className="lg-d" aria-hidden />
        </Link>
        <ThemeToggle />
      </div>
      <div className="login-card">{children}</div>
    </main>
  );
}
