"use client";

import React from "react";
import Link from "next/link";
import type { Habit } from "@/types/habit";
import type { HabitLog, Mood } from "@/types/log";
import { CounterButton } from "./CounterButton";
import { MoodPicker } from "./MoodPicker";
import { CategoryChip } from "./CategoryChip";
import { getEffectiveStreak, calcFreeDays } from "@/lib/gamification";
import { HiSparkles, HiHandRaised } from "react-icons/hi2";

interface HabitCardProps {
  habit: Habit;
  todayLog?: HabitLog;
  today: string;
  onIncrement: () => Promise<void> | void;
  onDecrement: () => Promise<void> | void;
  onSetMood: (mood: Mood | null) => Promise<void> | void;
  disabled?: boolean;
}

export function HabitCard({
  habit,
  todayLog,
  today,
  onIncrement,
  onDecrement,
  onSetMood,
  disabled = false,
}: HabitCardProps) {
  const isGood = habit.category === "good";
  const count = todayLog?.count || 0;
  const streak = isGood
    ? getEffectiveStreak(habit, today)
    : calcFreeDays(habit.startDate, habit.lastLogDate, today);

  return (
    <div
      className={`flex flex-col gap-3 rounded-3xl border border-border bg-surface p-4 shadow-soft transition-all md:p-5 ${
        isGood ? "border-l-4 border-l-good" : "border-l-4 border-l-bad"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Habit info & category icon */}
        <Link
          href={`/kebiasaan/${habit.id}`}
          className="flex flex-1 items-center gap-3.5 min-w-0 group"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${
              isGood ? "bg-good/15 text-good" : "bg-bad/15 text-bad"
            }`}
          >
            {isGood ? (
              <HiSparkles className="h-5 w-5" />
            ) : (
              <HiHandRaised className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-base font-bold text-fg group-hover:text-primary transition-colors">
              {habit.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <CategoryChip category={habit.category} />
              <span
                className={
                  isGood
                    ? "font-semibold text-primary"
                    : "font-semibold text-muted"
                }
              >
                {isGood
                  ? `${streak} hari streak`
                  : streak === 0
                  ? "Mulai lagi hari ini"
                  : `${streak} hari bebas`}
              </span>
            </div>
          </div>
        </Link>

        {/* Counter controls */}
        <div className="shrink-0">
          <CounterButton
            count={count}
            category={habit.category}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Mood Picker appears when count > 0 */}
      {count > 0 && (
        <div className="border-t border-border/60 pt-1">
          <MoodPicker
            currentMood={todayLog?.mood || null}
            onSelectMood={onSetMood}
          />
        </div>
      )}
    </div>
  );
}

