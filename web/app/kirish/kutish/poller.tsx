"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { t } from "@/lib/strings.uz";
import { checkLogin, completeLogin } from "../actions";

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
      <p className="mt-6 text-sm text-muted" role="status">
        {t.common.loading}
      </p>
    );
  }
  return (
    <div className="mt-6" role="alert">
      <p className="text-sm text-danger">{t.auth.expired}</p>
      <div className="mt-3">
        <ButtonLink href="/kirish" variant="secondary">
          {t.auth.retry}
        </ButtonLink>
      </div>
    </div>
  );
}
