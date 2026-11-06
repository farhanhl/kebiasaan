"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "flowbite-react";
import Image from "next/image";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/hari-ini");
      } else {
        router.replace("/masuk");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-4 text-center">
      <div className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-glow animate-pulse">
        <Image
          src="/icon.png"
          alt="Logo Kebiasaan"
          width={64}
          height={64}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-fg">
        Kebiasaan
      </h1>
      <p className="mt-1 text-xs text-muted">Habit Tracker</p>
      <div className="mt-6 flex items-center gap-2 text-xs text-muted">
        <Spinner size="sm" color="info" />
        <span>Memuat...</span>
      </div>
    </div>
  );
}
