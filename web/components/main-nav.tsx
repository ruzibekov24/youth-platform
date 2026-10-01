"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { t } from "@/lib/strings.uz";

const ITEMS = [
  { href: "/", label: t.nav.home },
  { href: "/klublar", label: t.nav.clubs },
  { href: "/imkoniyatlar", label: t.nav.opportunities },
  { href: "/miya", label: t.nav.miya },
  { href: "/profil", label: t.nav.profile, authOnly: true },
] as const;

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
}

// Desktop: header ichida. Mobil: pastki panel (bosh barmoq yetadigan joy).
export function MainNav({ loggedIn, variant }: { loggedIn: boolean; variant: "top" | "bottom" }) {
  const path = usePathname();
  const items = ITEMS.filter((i) => loggedIn || !("authOnly" in i));

  if (variant === "top") {
    return (
      <nav aria-label="Asosiy" className="hidden items-center gap-1 sm:flex">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            aria-current={isActive(path, i.href) ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors hover:bg-surface",
              isActive(path, i.href) ? "text-accent" : "text-ink",
            )}
          >
            {i.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Asosiy"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg sm:hidden"
    >
      <ul className="mx-auto grid max-w-md" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={isActive(path, i.href) ? "page" : undefined}
              className={cn(
                "flex min-h-14 items-center justify-center px-1 text-xs font-medium",
                isActive(path, i.href) ? "text-accent" : "text-muted",
              )}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
