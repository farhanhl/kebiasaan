"use client";

import { useSyncExternalStore } from "react";
import { copy } from "@/lib/copy";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function OfflineBanner() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 z-50 mx-auto max-w-md rounded-2xl border border-accent/40 bg-surface/95 p-3 text-center text-xs font-semibold text-accent shadow-glow backdrop-blur-md"
      style={{
        top: "max(0.75rem, calc(env(safe-area-inset-top, 0px) + 0.5rem))",
      }}
    >
      {copy.offline}
    </div>
  );
}
