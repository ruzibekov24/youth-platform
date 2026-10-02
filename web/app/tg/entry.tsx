"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { TelegramMark } from "@/components/icons";
import { applyTelegramTheme, markMiniApp, TG_SDK, telegramApp } from "@/components/telegram/webapp";
import { Tile } from "@/components/ui/tile";
import { t } from "@/lib/strings.uz";
import { tgLogin } from "./actions";

type State = "loading" | "register" | "outside" | "error";

export function MiniAppEntry({ bot }: { bot: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>("loading");
  const c = t.tg;

  async function start() {
    const app = telegramApp();
    if (!app) {
      setState("outside");
      return;
    }
    markMiniApp();
    app.ready();
    app.expand();
    applyTelegramTheme(app);
    setState("loading");
    const r = await tgLogin(app.initData);
    if (r === "ok") {
      router.replace("/asosiy");
      router.refresh();
    } else setState(r);
  }

  return (
    <>
      <Script src={TG_SDK} strategy="afterInteractive" onReady={() => void start()} onError={() => setState("outside")} />
      <Tile name={state === "register" ? "key" : "base"} size={84} className="tile-lg" />
      {state === "loading" && (
        <p className="wait" role="status">
          <span className="dot" aria-hidden /> {c.loading}
        </p>
      )}
      {state === "register" && (
        <>
          <h1>{c.registerTitle}</h1>
          <p className="ph-lead">{c.registerText}</p>
          <button
            type="button"
            className="btn w big"
            onClick={() => telegramApp()?.openTelegramLink(`https://t.me/${bot}?start=app`)}
          >
            <TelegramMark mono className="tgm-btn" /> {c.registerCta}
          </button>
          <button type="button" className="btn ghost w" style={{ marginTop: 10 }} onClick={() => void start()}>
            {c.retry}
          </button>
        </>
      )}
      {(state === "outside" || state === "error") && (
        <>
          <p className="ph-lead">{state === "outside" ? c.notTelegram : c.error}</p>
          <Link href="/" className="btn ghost w" style={{ marginTop: 16 }}>
            {c.toSite}
          </Link>
        </>
      )}
    </>
  );
}
