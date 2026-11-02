"use client";

import React from "react";
import {
  calcLevel,
  xpForLevel,
  calcProgress,
  getLevelTitle,
} from "@/lib/gamification";

interface XpBarProps {
  xp: number;
  className?: string;
  showTitle?: boolean;
}

export function XpBar({ xp, className = "", showTitle = true }: XpBarProps) {
  const level = calcLevel(xp);
  const title = getLevelTitle(level);
  const progress = calcProgress(xp);
  const nextLevelXp = xpForLevel(level + 1);
  const xpNeeded = nextLevelXp - xp;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent/20 px-2.5 py-0.5 font-bold text-accent border border-accent/30 font-display">
            Level {level}
          </span>
          {showTitle && <span className="font-medium text-fg">{title}</span>}
        </div>
        <span className="text-muted text-[11px]">
          {xp} XP · Sisa {Math.max(0, xpNeeded)} XP ke Lv {level + 1}
        </span>
      </div>

      {/* Custom bubbly progress bar */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-surface-raised border border-border/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-secondary transition-all duration-500"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
