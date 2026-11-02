"use client";

import React from "react";
import Link from "next/link";
import { Button } from "flowbite-react";
import { BlobBackground } from "@/components/ui/BlobBackground";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <BlobBackground />
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-soft space-y-4 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-raised text-primary border border-border">
          <HiExclamationTriangle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-bold text-fg">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-xs text-muted">
          Sepertinya rute yang kamu tuju salah atau sudah dipindahkan.
        </p>
        <Link href="/hari-ini" className="w-full">
          <Button
            color="default"
            className="w-full rounded-full shadow-glow font-semibold"
          >
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
