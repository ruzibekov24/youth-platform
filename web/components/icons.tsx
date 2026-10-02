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

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12.5l4.2 4L19 7" />
  </svg>
);
export const PinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const UsersIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0111 0M16 5.2a3 3 0 010 5.6M17.5 14.2A5.5 5.5 0 0120.5 19" />
  </svg>
);
export const ArrowUpRightIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);
export const BookmarkIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 4h12v17l-6-4-6 4z" />
  </svg>
);

export const SunriseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 18h16M7 14a5 5 0 0110 0M12 4v3M5.2 7.2l1.6 1.6M18.8 7.2l-1.6 1.6" />
  </svg>
);
export const ClubIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const CompassIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
);
export const BulbIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.4.3.6.8.6 1.3V16h6v-.9c0-.5.2-1 .6-1.3A6 6 0 0012 3z" />
  </svg>
);
export const UserIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0115 0" />
  </svg>
);
export const GearIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </svg>
);
export const FlagIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </svg>
);
export const ChevronRightIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const ArrowLeftIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const QrIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
  </svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const LockIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2.5" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </svg>
);

// Telegram belgisi o'z brend rangida qoladi (bu uning logotipi).
export const TelegramMark = ({ className, mono }: P & { mono?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <circle cx="12" cy="12" r="12" fill={mono ? "#fff" : "#29A9EB"} />
    <path
      d="M5.5 11.8l11.6-4.5c.5-.2 1 .1.8.9l-2 9.3c-.1.6-.5.8-1 .5l-2.9-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3 5.4-4.9c.2-.2 0-.3-.4-.1L8.4 13.5l-2.8-.9c-.6-.2-.6-.6.1-.8z"
      fill={mono ? "var(--color-accent)" : "#fff"}
    />
  </svg>
);
