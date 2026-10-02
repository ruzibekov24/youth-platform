// Kichik chiziqli ikonkalar. Rang currentColor dan olinadi.
type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const MicIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0014 0M12 18v3" />
  </svg>
);
export const DocIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const CalendarIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
export const BellIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 17v-6a6 6 0 0112 0v6l2 2H4zM10 21h4" />
  </svg>
);
export const ArrowCircleIcon = (p: P) => (
  <svg {...base} viewBox="0 0 16 16" strokeWidth={1.5} {...p}>
    <circle cx="8" cy="8" r="6.5" />
    <path d="M5.5 8h5M8.5 5.8L10.7 8l-2.2 2.2" />
  </svg>
);
export const ShieldIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
  </svg>
);

// Telegram belgisi o'z brend rangida qoladi (bu uning logotipi).
export const TelegramMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <circle cx="12" cy="12" r="12" fill="#29A9EB" />
    <path
      d="M5.5 11.8l11.6-4.5c.5-.2 1 .1.8.9l-2 9.3c-.1.6-.5.8-1 .5l-2.9-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3 5.4-4.9c.2-.2 0-.3-.4-.1L8.4 13.5l-2.8-.9c-.6-.2-.6-.6.1-.8z"
      fill="#fff"
    />
  </svg>
);
