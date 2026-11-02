"use client";

import React from "react";
import type { PeriodType } from "@/types/stats";

interface PeriodTabsProps {
  currentPeriod: PeriodType;
  onChange: (period: PeriodType) => void;
}

const TABS: { id: PeriodType; label: string }[] = [
  { id: "daily", label: "Harian" },
  { id: "weekly", label: "Mingguan" },
  { id: "monthly", label: "Bulanan" },
];

export function PeriodTabs({ currentPeriod, onChange }: PeriodTabsProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface p-1 w-fit shadow-soft">
      {TABS.map((tab) => {
        const isActive = currentPeriod === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-primary text-on-primary shadow-glow"
                : "text-muted hover:text-fg"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

