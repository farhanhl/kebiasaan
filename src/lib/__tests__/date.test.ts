import { describe, it, expect } from "vitest";
import {
  todayKey,
  yesterdayKey,
  weekKey,
  monthKey,
  diffInDays,
  isYesterday,
  isToday,
  formatDateId,
  getPastDays,
  getPastWeeks,
  getPastMonths,
} from "../date";

describe("lib/date", () => {
  it("todayKey respects Asia/Jakarta timezone", () => {
    // 2026-11-02 18:00 UTC is 2026-11-03 01:00 in Jakarta (+7)
    const utcDate = new Date("2026-11-02T18:00:00Z");
    const key = todayKey("Asia/Jakarta", utcDate);
    expect(key).toBe("2026-11-03");
  });

  it("yesterdayKey returns the day before today in timezone", () => {
    const utcDate = new Date("2026-11-02T18:00:00Z");
    const key = yesterdayKey("Asia/Jakarta", utcDate);
    expect(key).toBe("2026-11-02");
  });

  it("weekKey returns ISO week string starting on Monday", () => {
    // 2026-11-02 is Monday, ISO week 45
    expect(weekKey("2026-11-02")).toBe("2026-W45");
    // 2026-11-08 is Sunday, still week 45
    expect(weekKey("2026-11-08")).toBe("2026-W45");
    // 2026-11-09 is Monday, week 46
    expect(weekKey("2026-11-09")).toBe("2026-W46");
  });

  it("monthKey returns YYYY-MM string", () => {
    expect(monthKey("2026-11-02")).toBe("2026-11");
    expect(monthKey("2027-01-15")).toBe("2027-01");
  });

  it("diffInDays calculates day difference accurately", () => {
    expect(diffInDays("2026-11-05", "2026-11-02")).toBe(3);
    expect(diffInDays("2026-11-02", "2026-11-05")).toBe(-3);
    expect(diffInDays("2026-11-02", "2026-11-02")).toBe(0);
  });

  it("isYesterday and isToday check relation with today", () => {
    expect(isToday("2026-11-02", "2026-11-02")).toBe(true);
    expect(isToday("2026-11-01", "2026-11-02")).toBe(false);

    expect(isYesterday("2026-11-01", "2026-11-02")).toBe(true);
    expect(isYesterday("2026-10-31", "2026-11-02")).toBe(false);
  });

  it("formatDateId formats in Indonesian locale", () => {
    const formatted = formatDateId("2026-11-02");
    expect(formatted.toLowerCase()).toContain("senin");
    expect(formatted.toLowerCase()).toContain("november");
    expect(formatted).toContain("2026");
  });

  it("getPastDays returns array of dates in order ending with today", () => {
    const days = getPastDays(3, "2026-11-02");
    expect(days).toEqual(["2026-10-31", "2026-11-01", "2026-11-02"]);
  });

  it("getPastWeeks returns specified number of ISO weeks", () => {
    const weeks = getPastWeeks(3, "2026-11-02");
    expect(weeks).toHaveLength(3);
    expect(weeks[2].weekKey).toBe("2026-W45");
  });

  it("getPastMonths returns specified number of months", () => {
    const months = getPastMonths(3, "2026-11-02");
    expect(months).toHaveLength(3);
    expect(months[2].monthKey).toBe("2026-11");
    expect(months[1].monthKey).toBe("2026-10");
  });
});

