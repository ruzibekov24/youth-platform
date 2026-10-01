import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-bg p-5 shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
