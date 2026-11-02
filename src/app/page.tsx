"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "flowbite-react";
import { HiSun } from "react-icons/hi2";

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
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-secondary via-primary to-accent text-on-primary shadow-glow animate-pulse">
        <HiSun className="h-8 w-8" />
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
