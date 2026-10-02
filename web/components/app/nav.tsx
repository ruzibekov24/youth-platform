"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BulbIcon, ClubIcon, CompassIcon, SunriseIcon, UserIcon } from "@/components/icons";
import { t } from "@/lib/strings.uz";

const icons = [SunriseIcon, ClubIcon, CompassIcon, BulbIcon, UserIcon];

// Bitta ro'yxat: kompyuterda yuqori menyu, telefonda pastki tab bar.
export function AppNav({ variant }: { variant: "top" | "tabs" }) {
  const path = usePathname();
  const active = (href: string) =>
    path === href || path.startsWith(href + "/") || (href === "/profil" && path === "/sozlamalar");

  return (
    <nav className={variant === "top" ? "tnav" : "tabbar"} aria-label="Bo'limlar">
      {t.app.tabs.map((tab, i) => {
        const Icon = icons[i];
        const on = active(tab.href);
        return (
          <Link key={tab.href} href={tab.href} aria-current={on ? "page" : undefined} className={on ? "on" : undefined}>
            {variant === "tabs" && <Icon />}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
