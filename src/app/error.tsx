"use client";

import React, { useEffect } from "react";
import { Button } from "flowbite-react";
import { BlobBackground } from "@/components/ui/BlobBackground";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <BlobBackground />
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-soft space-y-4 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-raised text-bad border border-border">
          <HiExclamationTriangle className="h-8 w-8" />
        </div>
        <h2 className="font-display text-xl font-bold text-fg">
          Terjadi Kesalahan
        </h2>
        <p className="text-xs text-muted">
          Silakan coba tekan tombol di bawah untuk memuat ulang halaman.
        </p>
        <Button
          color="default"
          onClick={() => reset()}
          className="w-full rounded-full shadow-glow font-semibold"
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
