"use client";

import React from "react";
import { ChartSkeleton } from "./Skeletons";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  action,
  loading = false,
  empty = false,
  emptyMessage = "Belum ada data grafik.",
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 shadow-soft md:p-6 ${className}`}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold font-display text-fg">{title}</h3>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="w-full">
        {loading ? (
          <ChartSkeleton />
        ) : empty ? (
          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-border bg-surface-raised/30 text-sm text-muted">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

