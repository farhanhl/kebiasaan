"use client";

import React from "react";
import type { MoodCount } from "@/types/stats";

interface MoodSummaryProps {
  moods: MoodCount[];
}

const MOOD_META: Record<string, { emoji: string; label: string }> = {
  happy: { emoji: "😄", label: "Happy" },
  chill: { emoji: "😌", label: "Chill" },
  sad: { emoji: "😔", label: "Sad" },
  angry: { emoji: "😤", label: "Angry" },
  tired: { emoji: "😴", label: "Tired" },
};

export function MoodSummary({ moods }: MoodSummaryProps) {
  const totalWithMood = moods.reduce((acc, m) => acc + m.count, 0);

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft md:p-6 space-y-4">
      <div>
        <h4 className="font-display text-base font-bold text-fg">
          Distribusi Mood
        </h4>
        <p className="text-xs text-muted">
          Bagaimana perasaanmu saat mencatat kebiasaan pada periode ini
        </p>
      </div>

      {totalWithMood === 0 ? (
        <p className="py-6 text-center text-xs text-muted">
          Belum ada data mood yang dicatat pada periode ini.
        </p>
      ) : (
        <div className="space-y-3">
          {moods.map((m) => {
            const meta = MOOD_META[m.mood] || { emoji: "✨", label: m.mood };
            return (
              <div key={m.mood} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-fg">
                    <span className="text-base">{meta.emoji}</span>
                    <span>{meta.label}</span>
                  </span>
                  <span className="text-muted tabular-nums">
                    {m.count}x ({m.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all duration-500"
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

