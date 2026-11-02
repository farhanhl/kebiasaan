import type { Timestamp } from "firebase/firestore";

export type HabitCategory = "good" | "bad";

export interface HabitDoc {
  name: string;
  category: HabitCategory;
  emoji: string;
  note: string;
  startDate: string;
  isArchived: boolean;
  totalCount: number;
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Habit extends HabitDoc {
  id: string;
}

export interface HabitInput {
  name: string;
  category: HabitCategory;
  emoji?: string;
  note?: string;
  startDate?: string;
}

export type HabitPatch = Partial<Pick<HabitDoc, "name" | "emoji" | "note">>;

