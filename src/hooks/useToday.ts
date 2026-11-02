"use client";

import { useEffect, useState } from "react";
import { todayKey, weekKey, monthKey, DEFAULT_TIMEZONE } from "@/lib/date";

export function useToday(timezone: string = DEFAULT_TIMEZONE) {
  const [today, setToday] = useState(() => todayKey(timezone));

  useEffect(() => {
    const checkDate = () => {
      const current = todayKey(timezone);
      setToday((prev) => (prev !== current ? current : prev));
    };

    // Check on visibility change (e.g. user returns to tab next day)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkDate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    // Calculate ms until next midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime() + 1000;

    const timer = setTimeout(() => {
      checkDate();
    }, msUntilMidnight);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(timer);
    };
  }, [timezone]);

  return {
    today,
    weekKey: weekKey(today),
    monthKey: monthKey(today),
  };
}

