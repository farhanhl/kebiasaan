"use client";

import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { HiDevicePhoneMobile } from "react-icons/hi2";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [showIosPrompt] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
    );
  });

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        Boolean(
          (window.navigator as unknown as { standalone?: boolean }).standalone
        ));
    if (isStandalone) return true;

    const dismissedUntil = localStorage.getItem("install_dismissed_until");
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    const nextTime = Date.now() + 14 * 24 * 60 * 60 * 1000;
    localStorage.setItem("install_dismissed_until", String(nextTime));
    setDismissed(true);
  };

  if (dismissed || (!deferredPrompt && !showIosPrompt)) {
    return null;
  }

  return (
    <div className="fixed bottom-24 inset-x-4 z-40 mx-auto max-w-md rounded-3xl border border-primary/40 bg-surface/95 p-4 shadow-glow backdrop-blur-md md:bottom-6 md:right-6 md:left-auto md:w-80">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-secondary via-primary to-accent text-on-primary shadow-glow">
            <HiDevicePhoneMobile className="h-5 w-5 text-on-primary" />
          </span>
          <div>
            <h4 className="font-display text-sm font-bold text-fg">
              Pasang Kebiasaan
            </h4>
            <p className="text-[11px] text-muted">
              {showIosPrompt
                ? "Ketuk ikon Bagikan lalu pilih Tambah ke Layar Utama."
                : "Akses cepat langsung dari layar utama HP kamu."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Tutup ajakan pasang"
          className="text-muted hover:text-fg text-xs p-1"
        >
          ✕
        </button>
      </div>

      {deferredPrompt && (
        <div className="mt-3 flex justify-end gap-2">
          <Button
            size="xs"
            color="default"
            onClick={handleInstallClick}
            className="rounded-full shadow-glow font-semibold"
          >
            Pasang Sekarang
          </Button>
        </div>
      )}
    </div>
  );
}
