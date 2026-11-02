"use client";

import React from "react";
import type { BadgeId } from "@/types/user";
import { badgeMeta } from "@/lib/copy";

const ALL_BADGES: BadgeId[] = [
  "first_habit",
  "first_log",
  "streak_3",
  "streak_7",
  "streak_30",
  "clean_7",
  "clean_30",
  "logs_100",
  "habit_5",
];

interface BadgeGridProps {
  unlockedBadges?: Partial<Record<BadgeId, unknown>>;
  className?: string;
}

export function BadgeGrid({
  unlockedBadges = {},
  className = "",
}: BadgeGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 ${className}`}
    >
      {ALL_BADGES.map((id) => {
        const meta = badgeMeta[id];
        const isUnlocked = Boolean(unlockedBadges[id]);

        return (
          <div
            key={id}
            className={`flex flex-col items-center justify-center rounded-3xl border p-4 text-center transition-all ${
              isUnlocked
                ? "border-primary/40 bg-surface shadow-glow"
                : "border-border/60 bg-surface/40 opacity-50 grayscale"
            }`}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl mb-2 ${
                isUnlocked
                  ? "bg-gradient-to-tr from-accent/20 via-primary/20 to-secondary/20 shadow-glow"
                  : "bg-surface-raised text-muted"
              }`}
            >
              {isUnlocked ? meta.emoji : "🔒"}
            </div>

            <h4 className="font-display text-sm font-bold text-fg">
              {meta.name}
            </h4>

            <p className="mt-1 text-[11px] text-muted line-clamp-2">
              {meta.desc}
            </p>

            <span className="mt-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
              +{meta.xp} XP
            </span>
          </div>
        );
      })}
    </div>
  );
}

