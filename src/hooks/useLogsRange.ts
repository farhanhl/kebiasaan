"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { subscribeLogsRange } from "@/lib/firebase/logs";
import type { HabitLog } from "@/types/log";

export function useLogsRange(startDate: string, endDate: string) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !startDate || !endDate) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeLogsRange(
      user.uid,
      startDate,
      endDate,
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
  }, [user, startDate, endDate]);

  return {
    logs: user ? logs : [],
    loading: user ? loading : false,
    error,
  };
}

