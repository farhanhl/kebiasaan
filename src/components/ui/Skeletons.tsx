import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-surface-raised ${className}`}
    />
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 shadow-soft ${className}`}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}

export function HabitCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-border bg-surface p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div
      className="flex flex-col justify-end gap-2 rounded-2xl bg-surface-raised/40 p-4"
      style={{ height }}
    >
      <div className="flex h-full items-end justify-between gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-full animate-pulse rounded-t-lg bg-surface-raised"
            style={{ height: `${20 + ((i * 37) % 70)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-6" />
        ))}
      </div>
    </div>
  );
}

