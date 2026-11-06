"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "./useAuth";
import { useToday } from "./useToday";
import { subscribeTodayLogs } from "@/lib/firebase/logs";
import type { HabitLog } from "@/types/log";

export function useTodayLogs() {
  const { user } = useAuth();
  const { today, weekKey, monthKey } = useToday();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeTodayLogs(
      user.uid,
      today,
      (data) => {
        setLogs(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, today]);

  const logsByHabitId = useMemo(() => {
    const map = new Map<string, HabitLog>();
    for (const log of logs) {
      map.set(log.habitId, log);
    }
    return map;
  }, [logs]);

  return {
    today,
    weekKey,
    monthKey,
    logs: user ? logs : [],
    logsByHabitId,
    loading: user ? loading : false,
    error,
  };
}

