import type { BadgeId, UserDoc } from "@/types/user";
import type { Habit, HabitCategory } from "@/types/habit";
import { diffInDays, isYesterday, isToday } from "./date";

export const XP_PER_GOOD_LOG = 10;
export const XP_DAILY_CAP_PER_HABIT = 10;
export const XP_BAD_LOG = 0;
export const LEVEL_BASE = 50;

export function calcLevel(xp: number): number {
  const safeXp = Math.max(0, xp);
  return Math.floor(Math.sqrt(safeXp / LEVEL_BASE)) + 1;
}

export function xpForLevel(level: number): number {
  const safeLvl = Math.max(1, level);
  return LEVEL_BASE * (safeLvl - 1) ** 2;
}

export function calcProgress(xp: number): number {
  const safeXp = Math.max(0, xp);
  const currentLvl = calcLevel(safeXp);
  const currentLevelXp = xpForLevel(currentLvl);
  const nextLevelXp = xpForLevel(currentLvl + 1);

  if (nextLevelXp === currentLevelXp) return 1;
  const progress = (safeXp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  return Math.min(1, Math.max(0, progress));
}

export function getLevelTitle(level: number): string {
  if (level <= 2) return "Pemula Santuy";
  if (level <= 4) return "Mulai Konsisten";
  if (level <= 7) return "Habit Hunter";
  if (level <= 11) return "Streak Master";
  return "Legenda Senja";
}

export function getEffectiveStreak(
  habit: { currentStreak: number; lastLogDate: string | null },
  today: string
): number {
  if (!habit.lastLogDate) return 0;
  const diff = diffInDays(today, habit.lastLogDate);
  if (diff > 1) return 0;
  return habit.currentStreak || 0;
}

export function calcFreeDays(
  startDate: string,
  lastLogDate: string | null,
  today: string
): number {
  const baseline = lastLogDate || startDate;
  const days = diffInDays(today, baseline);
  return Math.max(0, days);
}

export function recomputeStreak(
  sortedDatesDesc: string[],
  today: string
): number {
  if (!sortedDatesDesc || sortedDatesDesc.length === 0) return 0;

  // Filter unique dates and sort descending
  const uniqueDates = Array.from(new Set(sortedDatesDesc)).sort((a, b) =>
    b.localeCompare(a)
  );

  const mostRecent = uniqueDates[0];
  const diff = diffInDays(today, mostRecent);

  // If most recent log is older than yesterday, streak is broken
  if (diff > 1) return 0;

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = uniqueDates[i];
    const prev = uniqueDates[i + 1];
    if (diffInDays(current, prev) === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calcXpGain(category: HabitCategory, currentDayCount: number): number {
  if (category === "bad") return 0;
  if (currentDayCount < XP_DAILY_CAP_PER_HABIT) {
    return XP_PER_GOOD_LOG;
  }
  return 0;
}

export function evaluateBadges(
  user: Partial<UserDoc>,
  habits: Habit[],
  today: string = new Date().toISOString().slice(0, 10)
): BadgeId[] {
  const existingBadges = user.badges || {};
  const unlocked: BadgeId[] = [];

  const hasBadge = (id: BadgeId) => Boolean(existingBadges[id]);

  if (!hasBadge("first_habit") && habits.length >= 1) {
    unlocked.push("first_habit");
  }

  const totalLogs = (user.totalGoodLogs || 0) + (user.totalBadLogs || 0);
  if (!hasBadge("first_log") && totalLogs >= 1) {
    unlocked.push("first_log");
  }

  const streak = user.dailyStreak || 0;
  if (!hasBadge("streak_3") && streak >= 3) {
    unlocked.push("streak_3");
  }
  if (!hasBadge("streak_7") && streak >= 7) {
    unlocked.push("streak_7");
  }
  if (!hasBadge("streak_30") && streak >= 30) {
    unlocked.push("streak_30");
  }

  if (!hasBadge("logs_100") && (user.totalGoodLogs || 0) >= 100) {
    unlocked.push("logs_100");
  }

  const activeHabits = habits.filter((h) => !h.isArchived);
  if (!hasBadge("habit_5") && activeHabits.length >= 5) {
    unlocked.push("habit_5");
  }

  // Clean streak for bad habits
  const badHabits = habits.filter((h) => h.category === "bad" && !h.isArchived);
  let maxFreeDays = 0;
  for (const h of badHabits) {
    const free = calcFreeDays(h.startDate, h.lastLogDate, today);
    if (free > maxFreeDays) maxFreeDays = free;
  }

  if (!hasBadge("clean_7") && maxFreeDays >= 7) {
    unlocked.push("clean_7");
  }
  if (!hasBadge("clean_30") && maxFreeDays >= 30) {
    unlocked.push("clean_30");
  }

  return unlocked;
}

export function updateStreakOnGoodLog(
  lastActiveDate: string | null,
  currentStreak: number,
  longestStreak: number,
  today: string
): { currentStreak: number; longestStreak: number; isFirstLogToday: boolean } {
  if (isToday(lastActiveDate || "", today)) {
    return {
      currentStreak,
      longestStreak,
      isFirstLogToday: false,
    };
  }

  let nextStreak = 1;
  if (lastActiveDate && isYesterday(lastActiveDate, today)) {
    nextStreak = currentStreak + 1;
  }

  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(longestStreak, nextStreak),
    isFirstLogToday: true,
  };
}

