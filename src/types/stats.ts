import type { HabitCategory } from "./habit";
import type { Mood } from "./log";

export type PeriodType = "daily" | "weekly" | "monthly";

export interface SummaryData {
  totalGood: number;
  totalBad: number;
  balanceScore: number;
  currentStreak: number;
  prevGood: number;
  prevBad: number;
  prevBalanceScore: number;
  prevStreak: number;
  goodDiffPercent: number;
  badDiffPercent: number;
  balanceDiff: number;
  streakDiff: number;
}

export interface TrendItem {
  key: string;
  label: string;
  good: number;
  bad: number;
}

export interface HabitStatItem {
  habitId: string;
  name: string;
  emoji: string;
  category: HabitCategory;
  count: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface MoodCount {
  mood: Mood;
  count: number;
  percentage: number;
}

