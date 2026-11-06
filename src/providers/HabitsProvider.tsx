"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { subscribeHabits } from "@/lib/firebase/habits";
import type { Habit } from "@/types/habit";

export interface HabitsContextValue {
  habits: Habit[];
  loading: boolean;
  error: Error | null;
}

const HabitsContext = createContext<HabitsContextValue>({
  habits: [],
  loading: false,
  error: null,
});

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeHabits(
      user.uid,
      (data) => {
        setHabits(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const value: HabitsContextValue = {
    habits: user ? habits : [],
    loading: user ? loading : false,
    error,
  };

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}

export function useHabitsContext() {
  return useContext(HabitsContext);
}

