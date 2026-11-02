"use client";

import React from "react";
import type { HabitStatItem } from "@/types/stats";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";

interface TopHabitsProps {
  topGood: HabitStatItem[];
  topBad: HabitStatItem[];
}

export function TopHabits({ topGood, topBad }: TopHabitsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Top Good Habits */}
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-good shadow-glow" />
          <h4 className="font-display text-base font-bold text-fg">
            Top Kebiasaan Baik
          </h4>
        </div>

        {topGood.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted">
            Belum ada catatan kebiasaan baik pada periode ini.
          </p>
        ) : (
          <div className="space-y-2">
            {topGood.map((item, idx) => (
              <Link
                key={item.habitId}
                href={`/kebiasaan/${item.habitId}`}
                className="flex items-center justify-between rounded-2xl border border-border/40 bg-surface-raised/30 p-2.5 transition-colors hover:border-good/50 hover:bg-surface-raised"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-raised text-[11px] font-bold text-muted">
                    {idx + 1}
                  </span>
                  <span className="text-lg">{item.emoji}</span>
                  <span className="truncate text-xs font-semibold text-fg">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold font-display text-good tabular-nums">
                    {item.count}x
                  </span>
                  <HiChevronRight className="h-3.5 w-3.5 text-muted" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top Bad Habits */}
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-bad shadow-glow" />
          <h4 className="font-display text-base font-bold text-fg">
            Top Kebiasaan Buruk
          </h4>
        </div>

        {topBad.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted">
            Belum ada catatan kebiasaan buruk pada periode ini.
          </p>
        ) : (
          <div className="space-y-2">
            {topBad.map((item, idx) => (
              <Link
                key={item.habitId}
                href={`/kebiasaan/${item.habitId}`}
                className="flex items-center justify-between rounded-2xl border border-border/40 bg-surface-raised/30 p-2.5 transition-colors hover:border-bad/50 hover:bg-surface-raised"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-raised text-[11px] font-bold text-muted">
                    {idx + 1}
                  </span>
                  <span className="text-lg">{item.emoji}</span>
                  <span className="truncate text-xs font-semibold text-fg">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold font-display text-bad tabular-nums">
                    {item.count}x
                  </span>
                  <HiChevronRight className="h-3.5 w-3.5 text-muted" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
