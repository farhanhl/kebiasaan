import type { Timestamp } from "firebase/firestore";
import type { HabitCategory } from "./habit";
import type { BadgeId } from "./user";

export type Mood = "happy" | "chill" | "sad" | "angry" | "tired";

export interface LogDoc {
  habitId: string;
  category: HabitCategory;
  date: string;
  weekKey: string;
  monthKey: string;
  count: number;
  mood: Mood | null;
  xpEarned: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HabitLog extends LogDoc {
  id: string;
}

export interface LogResult {
  count: number;
  xpDelta: number;
  levelUp: boolean;
  newBadges: BadgeId[];
  perfectDay: boolean;
}

export interface LogContext {
  date: string;
  weekKey: string;
  monthKey: string;
}

