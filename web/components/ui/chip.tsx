import Link from "next/link";
import { cn } from "@/lib/cn";

// Filtr tugmasi: oddiy havola, URL query orqali ishlaydi (JS shart emas).
export function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-bg text-ink hover:bg-surface",
      )}
    >
      {children}
    </Link>
  );
}
