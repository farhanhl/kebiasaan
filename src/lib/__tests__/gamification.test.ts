import { describe, it, expect } from "vitest";
import {
  calcLevel,
  xpForLevel,
  calcProgress,
  getLevelTitle,
  getEffectiveStreak,
  calcFreeDays,
  recomputeStreak,
  calcXpGain,
  evaluateBadges,
  updateStreakOnGoodLog,
  XP_PER_GOOD_LOG,
} from "../gamification";
import type { Habit } from "@/types/habit";
import type { UserDoc } from "@/types/user";
import type { Timestamp } from "firebase/firestore";

describe("lib/gamification - Test Wajib", () => {
  it("calcLevel on XP boundaries", () => {
    expect(calcLevel(0)).toBe(1);
    expect(calcLevel(49)).toBe(1);
    expect(calcLevel(50)).toBe(2);
    expect(calcLevel(199)).toBe(2);
    expect(calcLevel(200)).toBe(3);
    expect(calcLevel(449)).toBe(3);
    expect(calcLevel(450)).toBe(4);
    expect(calcLevel(799)).toBe(4);
    expect(calcLevel(800)).toBe(5);
  });

  it("xpForLevel returns correct minimum XP", () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(50);
    expect(xpForLevel(3)).toBe(200);
    expect(xpForLevel(4)).toBe(450);
    expect(xpForLevel(5)).toBe(800);
  });

  it("calcProgress stays between 0 and 1", () => {
    expect(calcProgress(0)).toBe(0);
    expect(calcProgress(25)).toBe(0.5);
    expect(calcProgress(50)).toBe(0); // Level 2 start
    expect(calcProgress(125)).toBe(0.5);
  });

  it("getLevelTitle returns appropriate titles", () => {
    expect(getLevelTitle(1)).toBe("Pemula Santuy");
    expect(getLevelTitle(2)).toBe("Pemula Santuy");
    expect(getLevelTitle(3)).toBe("Mulai Konsisten");
    expect(getLevelTitle(5)).toBe("Habit Hunter");
    expect(getLevelTitle(8)).toBe("Streak Master");
    expect(getLevelTitle(12)).toBe("Legenda Senja");
  });

  it("calcXpGain: 10th log gives XP, 11th does not", () => {
    expect(calcXpGain("good", 0)).toBe(XP_PER_GOOD_LOG);
    expect(calcXpGain("good", 9)).toBe(XP_PER_GOOD_LOG);
    expect(calcXpGain("good", 10)).toBe(0);
    expect(calcXpGain("good", 11)).toBe(0);
    expect(calcXpGain("bad", 0)).toBe(0);
  });

  it("streak: consecutive days, skip day (reset), same day (no change)", () => {
    const today = "2026-11-03";
    const yesterday = "2026-11-02";
    const twoDaysAgo = "2026-11-01";

    // Consecutive day
    const s1 = updateStreakOnGoodLog(yesterday, 3, 3, today);
    expect(s1.currentStreak).toBe(4);
    expect(s1.longestStreak).toBe(4);
    expect(s1.isFirstLogToday).toBe(true);

    // Skipped day -> resets to 1
    const s2 = updateStreakOnGoodLog(twoDaysAgo, 5, 5, today);
    expect(s2.currentStreak).toBe(1);
    expect(s2.longestStreak).toBe(5);
    expect(s2.isFirstLogToday).toBe(true);

    // Second log on same day -> unchanged
    const s3 = updateStreakOnGoodLog(today, 4, 4, today);
    expect(s3.currentStreak).toBe(4);
    expect(s3.isFirstLogToday).toBe(false);
  });

  it("getEffectiveStreak resets to 0 if lastLogDate is older than yesterday", () => {
    const today = "2026-11-03";
    expect(getEffectiveStreak({ currentStreak: 5, lastLogDate: "2026-11-03" }, today)).toBe(5);
    expect(getEffectiveStreak({ currentStreak: 5, lastLogDate: "2026-11-02" }, today)).toBe(5);
    expect(getEffectiveStreak({ currentStreak: 5, lastLogDate: "2026-11-01" }, today)).toBe(0);
    expect(getEffectiveStreak({ currentStreak: 5, lastLogDate: null }, today)).toBe(0);
  });

  it("calcFreeDays for bad habit", () => {
    const today = "2026-11-10";
    // Never logged -> based on startDate
    expect(calcFreeDays("2026-11-03", null, today)).toBe(7);
    // Last logged 3 days ago
    expect(calcFreeDays("2026-11-01", "2026-11-07", today)).toBe(3);
    // Logged today -> 0 free days
    expect(calcFreeDays("2026-11-01", today, today)).toBe(0);
  });

  it("recomputeStreak calculates streak from date list", () => {
    const today = "2026-11-05";

    // Consecutive 4 days ending today
    const dates1 = ["2026-11-05", "2026-11-04", "2026-11-03", "2026-11-02"];
    expect(recomputeStreak(dates1, today)).toBe(4);

    // Consecutive 3 days ending yesterday (still active)
    const dates2 = ["2026-11-04", "2026-11-03", "2026-11-02"];
    expect(recomputeStreak(dates2, today)).toBe(3);

    // Broken streak (ended 2 days ago)
    const dates3 = ["2026-11-03", "2026-11-02", "2026-11-01"];
    expect(recomputeStreak(dates3, today)).toBe(0);

    // Gap in between
    const dates4 = ["2026-11-05", "2026-11-04", "2026-11-02"];
    expect(recomputeStreak(dates4, today)).toBe(2);
  });

  it("evaluateBadges does not grant already owned badges", () => {
    const dummyUser: Partial<UserDoc> = {
      dailyStreak: 7,
      totalGoodLogs: 105,
      badges: {
        first_habit: { seconds: 12345, nanoseconds: 0 },
        streak_3: { seconds: 12345, nanoseconds: 0 },
        first_log: { seconds: 12345, nanoseconds: 0 },
      },
    };

    const dummyHabits: Habit[] = [
      {
        id: "1",
        name: "Air",
        category: "good",
        emoji: "💧",
        note: "",
        startDate: "2026-10-01",
        isArchived: false,
        totalCount: 50,
        currentStreak: 7,
        longestStreak: 7,
        lastLogDate: "2026-11-02",
        createdAt: { seconds: 0, nanoseconds: 0 } as unknown as Timestamp,
        updatedAt: { seconds: 0, nanoseconds: 0 } as unknown as Timestamp,
      },
    ];

    const newBadges = evaluateBadges(dummyUser, dummyHabits, "2026-11-02");
    // Should earn streak_7 and logs_100, but NOT first_habit, first_log, streak_3
    expect(newBadges).toContain("streak_7");
    expect(newBadges).toContain("logs_100");
    expect(newBadges).not.toContain("first_habit");
    expect(newBadges).not.toContain("first_log");
    expect(newBadges).not.toContain("streak_3");
  });

  it("calcFreeDays reflects rolled-back lastLogDate accurately", () => {
    const today = "2026-11-10";
    const startDate = "2026-10-01";
    // If reverted to null (no previous logs)
    expect(calcFreeDays(startDate, null, today)).toBe(40);
    // If rolled back to previous log date 5 days ago
    expect(calcFreeDays(startDate, "2026-11-05", today)).toBe(5);
  });
});
