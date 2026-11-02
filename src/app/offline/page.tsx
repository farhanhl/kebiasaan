"use client";

import React from "react";
import { Button } from "flowbite-react";
import { BlobBackground } from "@/components/ui/BlobBackground";
import { HiSignalSlash } from "react-icons/hi2";

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <BlobBackground />
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-soft space-y-4 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-raised text-accent border border-border">
          <HiSignalSlash className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold text-fg">
          Kamu Sedang Offline
        </h1>
        <p className="text-xs text-muted">
          Catatan kebiasaanmu tetap tersimpan di perangkat ini dan otomatis disinkronkan saat koneksi internet kembali.
        </p>
        <Button
          color="default"
          onClick={handleReload}
          className="w-full rounded-full shadow-glow font-semibold"
        >
          Coba Muat Ulang
        </Button>
      </div>
    </div>
  );
}
