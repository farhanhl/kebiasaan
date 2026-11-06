"use client";

import { useHabitsContext } from "@/providers/HabitsProvider";

export function useHabits() {
  return useHabitsContext();
}
