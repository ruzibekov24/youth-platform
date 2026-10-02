// Telegram Mini App SDK (telegram-web-app.js) dan biz ishlatadigan qism.
export type TelegramWebApp = {
  initData: string;
  colorScheme: "light" | "dark";
  ready(): void;
  expand(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  openTelegramLink(url: string): void;
  onEvent(event: "themeChanged", cb: () => void): void;
  offEvent(event: "themeChanged", cb: () => void): void;
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void };
};

export const TG_SDK = "https://telegram.org/js/telegram-web-app.js";
const FLAG = "yb_tg";

export function telegramApp(): TelegramWebApp | null {
  const app = (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
  return app && app.initData ? app : null;
}

// Mini App ichidaligimizni sahifa qayta yuklanganda ham bilish uchun (sessionStorage Mini App bilan birga yo'qoladi).
export function markMiniApp() {
  try {
    sessionStorage.setItem(FLAG, "1");
  } catch {}
}
export function inMiniApp(): boolean {
  try {
    return sessionStorage.getItem(FLAG) === "1";
  } catch {
    return false;
  }
}

// Telegram temasiga ergashish: tanlov saqlanmaydi, faqat shu oynada qo'llanadi.
export function applyTelegramTheme(app: TelegramWebApp) {
  document.documentElement.dataset.theme = app.colorScheme;
  const bg = app.colorScheme === "dark" ? "#0c0e13" : "#ffffff";
  try {
    app.setHeaderColor(bg);
    app.setBackgroundColor(bg);
  } catch {}
}
