import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { t } from "@/lib/strings.uz";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {t.brand}
        </Link>
        <ButtonLink href="/kirish" variant="secondary" className="min-h-11">
          {t.nav.login}
        </ButtonLink>
      </Container>
    </header>
  );
}
