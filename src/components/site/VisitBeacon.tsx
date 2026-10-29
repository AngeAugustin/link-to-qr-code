"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stripLocalePath } from "@/lib/i18n/path";

/** Records a page view once per path, including client-side navigations. */
export function VisitBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    const bare = stripLocalePath(pathname);
    if (bare.startsWith("/admin") || bare.startsWith("/api")) return;

    const key = `trame-view:${pathname}`;
    const now = Date.now();
    try {
      const previous = Number(sessionStorage.getItem(key) || 0);
      if (now - previous < 2_000) return;
      sessionStorage.setItem(key, String(now));
    } catch {
      // Private mode still records the view.
    }

    const body = JSON.stringify({
      path: pathname,
      referrer: document.referrer || undefined,
    });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/visits", blob)) {
      void fetch("/api/visits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      });
    }
  }, [pathname]);

  return null;
}
