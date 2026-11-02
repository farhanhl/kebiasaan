"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BlobBackground } from "@/components/ui/BlobBackground";
import { Spinner } from "flowbite-react";
import Link from "next/link";
import { HiSun } from "react-icons/hi2";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/hari-ini");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner size="lg" color="info" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <BlobBackground />
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-secondary via-primary to-accent text-on-primary shadow-glow">
            <HiSun className="h-7 w-7" />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-fg">
            Kebiasaan
          </span>
        </Link>
        <p className="mt-1 text-xs text-muted">
          Catat kebiasaan harian, tetap konsisten dan terarah
        </p>
      </div>

      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        {children}
      </div>
    </div>
  );
}
