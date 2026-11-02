"use client";

import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";

export function SwRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check if there is an updated worker already waiting
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setShowUpdateToast(true);
          }

          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setWaitingWorker(newWorker);
                  setShowUpdateToast(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("ServiceWorker registration failed:", err);
        });

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    setShowUpdateToast(false);
  };

  if (!showUpdateToast) return null;

  return (
    <div className="fixed top-4 inset-x-4 z-50 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-surface/95 p-3 shadow-glow backdrop-blur-md">
      <div className="text-xs">
        <p className="font-bold text-fg">Versi Baru Tersedia!</p>
        <p className="text-muted text-[11px]">Muat ulang untuk memperbarui.</p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          size="xs"
          color="default"
          onClick={handleUpdate}
          className="rounded-full shadow-glow font-semibold"
        >
          Muat Ulang
        </Button>
        <button
          type="button"
          onClick={() => setShowUpdateToast(false)}
          className="text-muted hover:text-fg text-xs p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

