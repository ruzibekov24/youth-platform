"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { applyTelegramTheme, inMiniApp, TG_SDK, telegramApp } from "./webapp";

const ROOTS = new Set(["/asosiy", "/klublar", "/imkoniyatlar", "/miya", "/profil"]);

// Mini App ichida: Telegram temasi va Telegram'ning "Orqaga" tugmasi. Oddiy brauzerda hech narsa qilmaydi.
export function TelegramBridge() {
  const router = useRouter();
  const path = usePathname();
  const [ready, setReady] = useState(false);
  const [needSdk] = useState(() => typeof window !== "undefined" && inMiniApp());

  useEffect(() => {
    if (!ready) return;
    const app = telegramApp();
    if (!app) return;
    const sync = () => applyTelegramTheme(app);
    sync();
    app.onEvent("themeChanged", sync);
    return () => app.offEvent("themeChanged", sync);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const app = telegramApp();
    if (!app) return;
    const back = () => router.back();
    if (ROOTS.has(path)) app.BackButton.hide();
    else {
      app.BackButton.show();
      app.BackButton.onClick(back);
    }
    return () => app.BackButton.offClick(back);
  }, [ready, path, router]);

  if (!needSdk) return null;
  return <Script src={TG_SDK} strategy="afterInteractive" onReady={() => setReady(true)} />;
}
