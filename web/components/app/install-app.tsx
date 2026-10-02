"use client";

import { useEffect, useState } from "react";
import { inMiniApp } from "@/components/telegram/webapp";
import { t } from "@/lib/strings.uz";

type PromptEvent = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> };
type Mode = "hidden" | "prompt" | "ios";

// PWA o'rnatish: Android/Chrome'da tizim oynasi, iPhone'da yo'riqnoma. O'rnatilgan yoki Mini App bo'lsa ko'rinmaydi.
export function InstallApp() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [evt, setEvt] = useState<PromptEvent | null>(null);
  const s = t.app.settings;

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone || inMiniApp()) return;

    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as PromptEvent);
      setMode("prompt");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    // iPhone'da beforeinstallprompt yo'q: yo'riqnoma ko'rsatamiz (effekt tashqi tizimga obuna bo'lgach).
    const iosTimer = ios ? window.setTimeout(() => setMode("ios"), 0) : undefined;
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.clearTimeout(iosTimer);
    };
  }, []);

  if (mode === "hidden") return null;
  return (
    <div className="set-row">
      <div>
        <b>{s.install}</b>
        <div className="sub">{mode === "ios" ? s.installIos : s.installText}</div>
      </div>
      {mode === "prompt" && (
        <button
          type="button"
          className="btn"
          onClick={async () => {
            await evt?.prompt();
            setMode("hidden");
          }}
        >
          {s.installCta}
        </button>
      )}
    </div>
  );
}
