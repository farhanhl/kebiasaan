"use client";

import React, { useState } from "react";
import type { HabitCategory } from "@/types/habit";
import type { HeatmapDay } from "@/types/stats";
import { formatDateId } from "@/lib/date";

interface CalendarHeatmapProps {
  goodDays: HeatmapDay[];
  badDays: HeatmapDay[];
}

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function CalendarHeatmap({ goodDays, badDays }: CalendarHeatmapProps) {
  const [category, setCategory] = useState<HabitCategory>("good");
  const isGood = category === "good";
  const days = isGood ? goodDays : badDays;

  // Split into 7 rows (0: Monday ... 6: Sunday)
  const rows: HeatmapDay[][] = Array.from({ length: 7 }, () => []);

  days.forEach((day, idx) => {
    const dayOfWeek = idx % 7;
    rows[dayOfWeek].push(day);
  });

  const getCellBg = (level: number) => {
    if (level === 0) return "bg-surface-raised";
    if (isGood) {
      if (level === 1) return "bg-good/25";
      if (level === 2) return "bg-good/45";
      if (level === 3) return "bg-good/70";
      return "bg-good";
    } else {
      if (level === 1) return "bg-bad/25";
      if (level === 2) return "bg-bad/45";
      if (level === 3) return "bg-bad/70";
      return "bg-bad";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Category Toggle */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-display text-base font-bold text-fg">
            Kalender Heatmap (20 Minggu)
          </h4>
          <p className="text-xs text-muted">
            Konsistensi catatan setiap hari, dari Senin sampai Minggu
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface-raised/40 p-1 w-fit">
          <button
            type="button"
            onClick={() => setCategory("good")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              isGood
                ? "bg-good text-on-primary shadow-glow"
                : "text-muted hover:text-fg"
            }`}
          >
            Baik
          </button>
          <button
            type="button"
            onClick={() => setCategory("bad")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              !isGood
                ? "bg-bad text-on-primary shadow-glow"
                : "text-muted hover:text-fg"
            }`}
          >
            Buruk
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[540px]">
          <div className="flex gap-2">
            {/* Day Labels Column */}
            <div className="flex flex-col justify-between py-0.5 text-[10px] text-muted pr-1">
              {DAY_LABELS.map((label, i) => (
                <span key={i} className="h-3.5 leading-none">
                  {i % 2 === 0 ? label : ""}
                </span>
              ))}
            </div>

            {/* Grid Columns */}
            <div className="flex-1 space-y-1.5">
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1.5">
                  {row.map((day) => {
                    const formatted = formatDateId(day.date);
                    return (
                      <div
                        key={day.date}
                        title={`${day.count} kali pada ${formatted}`}
                        aria-label={`${day.count} kali pada ${formatted}`}
                        className={`h-3.5 flex-1 rounded-sm transition-transform hover:scale-125 hover:z-10 cursor-pointer ${getCellBg(
                          day.level
                        )}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-muted">
            <span>Sedikit</span>
            <div className="h-3 w-3 rounded-sm bg-surface-raised" />
            <div
              className={`h-3 w-3 rounded-sm ${
                isGood ? "bg-good/25" : "bg-bad/25"
              }`}
            />
            <div
              className={`h-3 w-3 rounded-sm ${
                isGood ? "bg-good/45" : "bg-bad/45"
              }`}
            />
            <div
              className={`h-3 w-3 rounded-sm ${
                isGood ? "bg-good/70" : "bg-bad/70"
              }`}
            />
            <div
              className={`h-3 w-3 rounded-sm ${
                isGood ? "bg-good" : "bg-bad"
              }`}
            />
            <span>Banyak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
