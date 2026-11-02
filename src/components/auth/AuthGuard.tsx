"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "flowbite-react";
import { HiSun } from "react-icons/hi2";

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
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-secondary via-primary to-accent text-on-primary shadow-glow animate-pulse">
          <HiSun className="h-8 w-8" />
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
