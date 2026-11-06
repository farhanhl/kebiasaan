"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "flowbite-react";
import Image from "next/image";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/masuk");
    }
  }, [user, loading, router]);

  if (loading) {
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
        <h2 className="mt-4 font-display text-xl font-bold text-fg">Kebiasaan</h2>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" color="info" />
          <span>Memuat sesi...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
