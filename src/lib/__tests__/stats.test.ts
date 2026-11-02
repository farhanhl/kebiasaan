import { describe, it, expect } from "vitest";
import {
  aggregateSummary,
  aggregateTrend,
  aggregateTopHabits,
  aggregateMood,
  aggregateHeatmap,
} from "../stats";
import type { HabitLog } from "@/types/log";
import type { Habit } from "@/types/habit";
import type { Timestamp } from "firebase/firestore";

const dummyTimestamp = { seconds: 0, nanoseconds: 0 } as unknown as Timestamp;

describe("lib/stats", () => {
  it("aggregateSummary calculates totals and balanceScore accurately", () => {
    const currentLogs: HabitLog[] = [
      {
        id: "l1",
        habitId: "h1",
        category: "good",
        date: "2026-11-02",
        weekKey: "2026-W45",
        monthKey: "2026-11",
        count: 6,
        mood: "happy",
        xpEarned: 10,
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
      {
        id: "l2",
        habitId: "h2",
        category: "bad",
        date: "2026-11-02",
        weekKey: "2026-W45",
        monthKey: "2026-11",
        count: 2,
        mood: "tired",
        xpEarned: 0,
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
    ];

    const prevLogs: HabitLog[] = [
      {
        id: "l0",
        habitId: "h1",
        category: "good",
        date: "2026-11-01",
        weekKey: "2026-W44",
        monthKey: "2026-11",
        count: 3,
        mood: "chill",
        xpEarned: 10,
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
    ];

    const summary = aggregateSummary(currentLogs, prevLogs, 3, 2);
    expect(summary.totalGood).toBe(6);
    expect(summary.totalBad).toBe(2);
    // 6 / (6 + 2) = 75%
    expect(summary.balanceScore).toBe(75);
    expect(summary.prevGood).toBe(3);
    expect(summary.prevBad).toBe(0);
    expect(summary.prevBalanceScore).toBe(100);
    // Good diff: (6 - 3)/3 = +100%
    expect(summary.goodDiffPercent).toBe(100);
  });

  it("aggregateTrend outputs 7 daily items", () => {
    const trend = aggregateTrend([], "daily", "2026-11-02");
    expect(trend).toHaveLength(7);
    expect(trend[6].key).toBe("2026-11-02");
  });

  it("aggregateTopHabits ranks habits by count descending", () => {
    const habits: Habit[] = [
      {
        id: "h1",
        name: "Minum",
        category: "good",
        emoji: "💧",
        note: "",
        startDate: "2026-10-01",
        isArchived: false,
        totalCount: 10,
        currentStreak: 2,
        longestStreak: 2,
        lastLogDate: "2026-11-02",
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
      {
        id: "h2",
        name: "Baca",
        category: "good",
        emoji: "📚",
        note: "",
        startDate: "2026-10-01",
        isArchived: false,
        totalCount: 20,
        currentStreak: 5,
        longestStreak: 5,
        lastLogDate: "2026-11-02",
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
    ];

    const logs: HabitLog[] = [
      {
        id: "1",
        habitId: "h1",
        category: "good",
        date: "2026-11-02",
        weekKey: "2026-W45",
        monthKey: "2026-11",
        count: 2,
        mood: null,
        xpEarned: 10,
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
      {
        id: "2",
        habitId: "h2",
        category: "good",
        date: "2026-11-02",
        weekKey: "2026-W45",
        monthKey: "2026-11",
        count: 5,
        mood: null,
        xpEarned: 10,
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
    ];

    const top = aggregateTopHabits(logs, habits);
    expect(top.topGood[0].name).toBe("Baca");
    expect(top.topGood[0].count).toBe(5);
    expect(top.topGood[1].name).toBe("Minum");
  });

  it("aggregateMood computes percentage correctly", () => {
    const logs: HabitLog[] = [
      {
        id: "1",
        habitId: "h1",
        category: "good",
        date: "2026-11-02",
        weekKey: "2026-W45",
        monthKey: "2026-11",
        count: 3,
        mood: "happy",
        xpEarned: 10,
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
      {
        id: "2",
        habitId: "h1",
        category: "good",
        date: "2026-11-02",
        weekKey: "2026-W45",
        monthKey: "2026-11",
        count: 1,
        mood: "sad",
        xpEarned: 10,
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
    ];

    const moods = aggregateMood(logs);
    const happy = moods.find((m) => m.mood === "happy");
    const sad = moods.find((m) => m.mood === "sad");
    expect(happy?.count).toBe(3);
    expect(happy?.percentage).toBe(75);
    expect(sad?.count).toBe(1);
    expect(sad?.percentage).toBe(25);
  });

  it("aggregateHeatmap assigns level based on count", () => {
    const logs: HabitLog[] = [
      {
        id: "1",
        habitId: "h1",
        category: "good",
        date: "2026-11-02",
        weekKey: "2026-W45",
        monthKey: "2026-11",
        count: 4,
        mood: null,
        xpEarned: 10,
        createdAt: dummyTimestamp,
        updatedAt: dummyTimestamp,
      },
    ];

    const heatmap = aggregateHeatmap(logs, "good", ["2026-11-01", "2026-11-02"]);
    expect(heatmap[0].level).toBe(0);
    expect(heatmap[1].level).toBe(3);
  });
});

