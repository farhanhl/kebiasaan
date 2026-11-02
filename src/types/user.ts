import type { Timestamp } from "firebase/firestore";

export type BadgeId =
  | "first_habit"
  | "first_log"
  | "streak_3"
  | "streak_7"
  | "streak_30"
  | "clean_7"
  | "clean_30"
  | "logs_100"
  | "habit_5";

export interface UserDoc {
  displayName: string;
  email: string;
  timezone: string;
  xp: number;
  level: number;
  dailyStreak: number;
  longestDailyStreak: number;
  lastActiveDate: string | null;
  totalGoodLogs: number;
  totalBadLogs: number;
  badges: Partial<Record<BadgeId, Timestamp | { seconds: number; nanoseconds: number }>>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile extends UserDoc {
  uid: string;
}

