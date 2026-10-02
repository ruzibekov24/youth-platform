"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { t } from "@/lib/strings.uz";
import { checkLogin, completeLogin } from "../actions";

// Bot savollar tugagach tokenni tasdiqlaydi; sahifa har 2.5 soniyada holatni so'raydi.
export function LoginPoller() {
  const router = useRouter();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let stopped = false;
    const timer = setInterval(async () => {
      const status = await checkLogin();
      if (stopped) return;
      if (status === "expired") {
        stopped = true;
        clearInterval(timer);
        setExpired(true);
      } else if (status === "ready") {
        stopped = true;
        clearInterval(timer);
        const next = await completeLogin();
        if (next) {
          router.replace(next);
          router.refresh();
        } else {
          setExpired(true);
        }
      }
    }, 2500);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [router]);

  if (!expired) {
    return (
      <p className="wait" role="status">
        <span className="dot" aria-hidden /> {t.app.login.waiting}
      </p>
    );
  }
  return (
    <div className="wait-x" role="alert">
      <p>{t.auth.expired}</p>
      <Link href="/kirish" className="btn ghost">
        {t.auth.retry}
      </Link>
    </div>
  );
}
