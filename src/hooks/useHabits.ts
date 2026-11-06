"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { subscribeHabits } from "@/lib/firebase/habits";
import type { Habit } from "@/types/habit";

export function useHabits() {
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

  return {
    habits: user ? habits : [],
    loading: user ? loading : false,
    error,
  };
}
