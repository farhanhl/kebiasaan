"use client";

import React from "react";
import { HiFire } from "react-icons/hi2";

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className = "" }: StreakBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary shadow-glow ${className}`}
    >
      <HiFire className="h-4 w-4 text-primary" />
      <span>{streak} Hari</span>
    </div>
  );
}
