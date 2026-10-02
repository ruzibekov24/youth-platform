"use client";

import { useId, useSyncExternalStore } from "react";
import { t } from "@/lib/strings.uz";
import "./theme-toggle.css";

type Theme = "light" | "dark";
const KEY = "theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function resolved(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return media().matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = media();
  mq.addEventListener("change", onChange);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", onChange);
  };
}

function apply(next: Theme) {
  const root = document.documentElement;
  const system: Theme = media().matches ? "dark" : "light";
  // Tizim bilan bir xil tanlansa, qayta tizimga ergashamiz.
  try {
    if (next === system) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, next);
  } catch {}
  if (next === system) delete root.dataset.theme;
  else root.dataset.theme = next;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, resolved, () => "light" as Theme);
  const dark = theme === "dark";
  const cut = `tt-${useId().replace(/:/g, "")}`;

  function toggle() {
    const next: Theme = dark ? "light" : "dark";
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm && document.startViewTransition) document.startViewTransition(() => apply(next));
    else apply(next);
  }

  return (
    <button
      type="button"
      className={`tt ${dark ? "is-dark" : ""} ${className}`}
      onClick={toggle}
      aria-label={dark ? t.theme.toLight : t.theme.toDark}
      title={dark ? t.theme.toLight : t.theme.toDark}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <mask id={cut}>
          <rect width="24" height="24" fill="#fff" />
          <circle className="tt-bite" cx="24" cy="0" r="7" fill="#000" />
        </mask>
        <g mask={`url(#${cut})`}>
          <circle className="tt-core" cx="12" cy="12" r="5" />
        </g>
        <g className="tt-rays">
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="12" y1="2.2" x2="12" y2="4.2" transform={`rotate(${i * 45} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  );
}
