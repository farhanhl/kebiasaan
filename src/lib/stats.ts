import type { Habit, HabitCategory } from "@/types/habit";
import type { HabitLog, Mood } from "@/types/log";
import type {
  PeriodType,
  SummaryData,
  TrendItem,
  HabitStatItem,
  HeatmapDay,
  MoodCount,
} from "@/types/stats";
import {
  getPastDays,
  getPastWeeks,
  getPastMonths,
  formatDateShort,
} from "./date";
import {
  parseISO,
  subDays,
  subWeeks,
  subMonths,
  format,
  startOfISOWeek,
  endOfISOWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export function aggregateSummary(
  currentLogs: HabitLog[],
  previousLogs: HabitLog[],
  currentStreak: number = 0,
  prevStreak: number = 0
): SummaryData {
  let totalGood = 0;
  let totalBad = 0;
  for (const log of currentLogs) {
    if (log.category === "good") {
      totalGood += log.count;
    } else {
      totalBad += log.count;
    }
  }

  let prevGood = 0;
  let prevBad = 0;
  for (const log of previousLogs) {
    if (log.category === "good") {
      prevGood += log.count;
    } else {
      prevBad += log.count;
    }
  }

  const balanceScore =
    totalGood + totalBad > 0
      ? Math.round((totalGood / (totalGood + totalBad)) * 100)
      : 0;

  const prevBalanceScore =
    prevGood + prevBad > 0
      ? Math.round((prevGood / (prevGood + prevBad)) * 100)
      : 0;

  const goodDiffPercent =
    prevGood > 0
      ? Math.round(((totalGood - prevGood) / prevGood) * 100)
      : totalGood > 0
      ? 100
      : 0;

  const badDiffPercent =
    prevBad > 0
      ? Math.round(((totalBad - prevBad) / prevBad) * 100)
      : totalBad > 0
      ? 100
      : 0;

  return {
    totalGood,
    totalBad,
    balanceScore,
    currentStreak,
    prevGood,
    prevBad,
    prevBalanceScore,
    prevStreak,
    goodDiffPercent,
    badDiffPercent,
    balanceDiff: balanceScore - prevBalanceScore,
    streakDiff: currentStreak - prevStreak,
  };
}

export function aggregateTrend(
  logs: HabitLog[],
  period: PeriodType,
  todayStr: string
): TrendItem[] {
  if (period === "daily") {
    const days = getPastDays(7, todayStr);
    const dayMap = new Map<string, { good: number; bad: number }>();
    for (const d of days) {
      dayMap.set(d, { good: 0, bad: 0 });
    }

    for (const log of logs) {
      const entry = dayMap.get(log.date);
      if (entry) {
        if (log.category === "good") entry.good += log.count;
        else entry.bad += log.count;
      }
    }

    return days.map((d) => ({
      key: d,
      label: formatDateShort(d),
      good: dayMap.get(d)?.good || 0,
      bad: dayMap.get(d)?.bad || 0,
    }));
  }

  if (period === "weekly") {
    const weeks = getPastWeeks(8, todayStr);
    const weekMap = new Map<string, { good: number; bad: number }>();
    for (const w of weeks) {
      weekMap.set(w.weekKey, { good: 0, bad: 0 });
    }

    for (const log of logs) {
      const entry = weekMap.get(log.weekKey);
      if (entry) {
        if (log.category === "good") entry.good += log.count;
        else entry.bad += log.count;
      }
    }

    return weeks.map((w) => ({
      key: w.weekKey,
      label: w.label,
      good: weekMap.get(w.weekKey)?.good || 0,
      bad: weekMap.get(w.weekKey)?.bad || 0,
    }));
  }

  // Monthly: 6 months
  const months = getPastMonths(6, todayStr);
  const monthMap = new Map<string, { good: number; bad: number }>();
  for (const m of months) {
    monthMap.set(m.monthKey, { good: 0, bad: 0 });
  }

  for (const log of logs) {
    const entry = monthMap.get(log.monthKey);
    if (entry) {
      if (log.category === "good") entry.good += log.count;
      else entry.bad += log.count;
    }
  }

  return months.map((m) => ({
    key: m.monthKey,
    label: m.label,
    good: monthMap.get(m.monthKey)?.good || 0,
    bad: monthMap.get(m.monthKey)?.bad || 0,
  }));
}

export function aggregateTopHabits(
  logs: HabitLog[],
  habits: Habit[]
): { topGood: HabitStatItem[]; topBad: HabitStatItem[] } {
  const habitMap = new Map<string, Habit>();
  for (const h of habits) {
    habitMap.set(h.id, h);
  }

  const counts = new Map<string, number>();
  for (const log of logs) {
    counts.set(log.habitId, (counts.get(log.habitId) || 0) + log.count);
  }

  const goodList: HabitStatItem[] = [];
  const badList: HabitStatItem[] = [];

  for (const [habitId, count] of counts.entries()) {
    const habit = habitMap.get(habitId);
    if (!habit) continue;
    const item: HabitStatItem = {
      habitId,
      name: habit.name,
      emoji: habit.emoji,
      category: habit.category,
      count,
    };
    if (habit.category === "good") {
      goodList.push(item);
    } else {
      badList.push(item);
    }
  }

  goodList.sort((a, b) => b.count - a.count);
  badList.sort((a, b) => b.count - a.count);

  return {
    topGood: goodList.slice(0, 5),
    topBad: badList.slice(0, 5),
  };
}

export function aggregateMood(logs: HabitLog[]): MoodCount[] {
  const allMoods: Mood[] = ["happy", "chill", "sad", "angry", "tired"];
  const counts = new Map<Mood, number>();
  for (const m of allMoods) {
    counts.set(m, 0);
  }

  let totalWithMood = 0;
  for (const log of logs) {
    if (log.mood) {
      counts.set(log.mood, (counts.get(log.mood) || 0) + log.count);
      totalWithMood += log.count;
    }
  }

  return allMoods.map((m) => {
    const count = counts.get(m) || 0;
    const percentage =
      totalWithMood > 0 ? Math.round((count / totalWithMood) * 100) : 0;
    return {
      mood: m,
      count,
      percentage,
    };
  });
}

export function aggregateHeatmap(
  logs: HabitLog[],
  category: HabitCategory,
  allDates: string[]
): HeatmapDay[] {
  const counts = new Map<string, number>();
  for (const log of logs) {
    if (log.category === category) {
      counts.set(log.date, (counts.get(log.date) || 0) + log.count);
    }
  }

  return allDates.map((date) => {
    const count = counts.get(date) || 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 7) level = 4;
    else if (count >= 4) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    return {
      date,
      count,
      level,
    };
  });
}

export function filterLogsByPeriod(
  logs: HabitLog[],
  period: PeriodType,
  today: string
): { currentLogs: HabitLog[]; prevLogs: HabitLog[]; periodLabel: string } {
  const todayDate = parseISO(today);

  if (period === "daily") {
    const yesterday = format(subDays(todayDate, 1), "yyyy-MM-dd");
    const current = logs.filter((l) => l.date === today);
    const prev = logs.filter((l) => l.date === yesterday);
    return { currentLogs: current, prevLogs: prev, periodLabel: "kemarin" };
  }

  if (period === "weekly") {
    const currentStart = format(startOfISOWeek(todayDate), "yyyy-MM-dd");
    const currentEnd = format(endOfISOWeek(todayDate), "yyyy-MM-dd");

    const prevWeekDate = subWeeks(todayDate, 1);
    const prevStart = format(startOfISOWeek(prevWeekDate), "yyyy-MM-dd");
    const prevEnd = format(endOfISOWeek(prevWeekDate), "yyyy-MM-dd");

    const current = logs.filter((l) => l.date >= currentStart && l.date <= currentEnd);
    const prev = logs.filter((l) => l.date >= prevStart && l.date <= prevEnd);
    return { currentLogs: current, prevLogs: prev, periodLabel: "minggu lalu" };
  }

  // Monthly
  const currentStart = format(startOfMonth(todayDate), "yyyy-MM-dd");
  const currentEnd = format(endOfMonth(todayDate), "yyyy-MM-dd");

  const prevMonthDate = subMonths(todayDate, 1);
  const prevStart = format(startOfMonth(prevMonthDate), "yyyy-MM-dd");
  const prevEnd = format(endOfMonth(prevMonthDate), "yyyy-MM-dd");

  const current = logs.filter((l) => l.date >= currentStart && l.date <= currentEnd);
  const prev = logs.filter((l) => l.date >= prevStart && l.date <= prevEnd);
  return { currentLogs: current, prevLogs: prev, periodLabel: "bulan lalu" };
}


