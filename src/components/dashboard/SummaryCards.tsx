"use client";

import React from "react";
import type { SummaryData } from "@/types/stats";

interface SummaryCardsProps {
  summary: SummaryData;
  periodLabel?: string;
}

export function SummaryCards({
  summary,
  periodLabel = "periode lalu",
}: SummaryCardsProps) {
  const {
    totalGood,
    totalBad,
    balanceScore,
    currentStreak,
    goodDiffPercent,
    badDiffPercent,
    balanceDiff,
    streakDiff,
  } = summary;

  const renderDiff = (diff: number, isGoodSentiment: boolean, isPercent = true) => {
    if (diff === 0) {
      return <span className="text-[11px] text-muted">Sama dengan {periodLabel}</span>;
    }
    const isPositive = diff > 0;
    const arrow = isPositive ? "▲" : "▼";
    const color = isPositive
      ? isGoodSentiment
        ? "text-good"
        : "text-bad"
      : isGoodSentiment
      ? "text-bad"
      : "text-good";

    return (
      <span className={`flex items-center gap-1 text-[11px] font-semibold ${color}`}>
        <span>{arrow}</span>
        <span>
          {Math.abs(diff)}
          {isPercent ? "%" : ""} vs {periodLabel}
        </span>
      </span>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {/* 1. Total Baik */}
      <div className="flex flex-col justify-between rounded-3xl border border-border border-l-4 border-l-good bg-surface p-4 shadow-soft">
        <span className="text-xs font-medium text-muted">Total Baik</span>
        <div className="my-2">
          <span className="font-display text-3xl font-bold tabular-nums text-fg sm:text-4xl">
            {totalGood}
          </span>
        </div>
        <div>{renderDiff(goodDiffPercent, true)}</div>
      </div>

      {/* 2. Total Buruk */}
      <div className="flex flex-col justify-between rounded-3xl border border-border border-l-4 border-l-bad bg-surface p-4 shadow-soft">
        <span className="text-xs font-medium text-muted">Total Buruk</span>
        <div className="my-2">
          <span className="font-display text-3xl font-bold tabular-nums text-fg sm:text-4xl">
            {totalBad}
          </span>
        </div>
        <div>{renderDiff(badDiffPercent, false)}</div>
      </div>

      {/* 3. Skor Keseimbangan */}
      <div className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-4 shadow-soft">
        <span className="text-xs font-medium text-muted">Keseimbangan</span>
        <div className="my-2">
          <span className="font-display text-3xl font-bold tabular-nums text-fg sm:text-4xl">
            {balanceScore}%
          </span>
        </div>
        <div>{renderDiff(balanceDiff, true, true)}</div>
      </div>

      {/* 4. Daily Streak */}
      <div className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-4 shadow-soft">
        <span className="text-xs font-medium text-muted">Daily Streak</span>
        <div className="my-2">
          <span className="font-display text-3xl font-bold tabular-nums text-primary sm:text-4xl">
            {currentStreak}
          </span>
        </div>
        <div>{renderDiff(streakDiff, true, false)}</div>
      </div>
    </div>
  );
}
