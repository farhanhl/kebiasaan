"use client";

import React, { useEffect } from "react";
import { Button } from "flowbite-react";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function AppSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App segment error caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface p-8 text-center shadow-soft space-y-4 my-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised text-bad border border-border">
        <HiExclamationTriangle className="h-7 w-7" />
      </div>
      <h3 className="font-display text-lg font-bold text-fg">
        Terjadi kendala saat memuat bagian ini
      </h3>
      <p className="max-w-xs text-xs text-muted">
        Coba tekan tombol di bawah untuk memuat ulang data.
      </p>
      <Button
        color="default"
        onClick={() => reset()}
        className="rounded-full shadow-glow font-semibold"
      >
        Coba Lagi
      </Button>
    </div>
  );
}
