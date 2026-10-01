import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { logout } from "@/app/kirish/actions";
import { getCurrentUser } from "@/lib/auth";
import { t } from "@/lib/strings.uz";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-line">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {t.brand}
        </Link>
        {user ? (
          <div className="flex items-center gap-1">
            <Link
              href="/sozlamalar"
              className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium hover:bg-surface"
            >
              {user.first_name}
            </Link>
            <form action={logout}>
              <Button type="submit" variant="ghost" className="px-3 text-sm">
                {t.nav.logout}
              </Button>
            </form>
          </div>
        ) : (
          <ButtonLink href="/kirish" variant="secondary">
            {t.nav.login}
          </ButtonLink>
        )}
      </Container>
    </header>
  );
}
