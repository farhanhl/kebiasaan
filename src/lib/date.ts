import {
  format,
  parseISO,
  subDays,
  differenceInCalendarDays,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  endOfISOWeek,
  subWeeks,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { id } from "date-fns/locale/id";

export const DEFAULT_TIMEZONE = "Asia/Jakarta";

export function todayKey(
  timezone: string = DEFAULT_TIMEZONE,
  date: Date = new Date()
): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: DEFAULT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }
}

export function yesterdayKey(
  timezone: string = DEFAULT_TIMEZONE,
  date: Date = new Date()
): string {
  const today = todayKey(timezone, date);
  const parsed = parseISO(today);
  const y = subDays(parsed, 1);
  return format(y, "yyyy-MM-dd");
}

export function weekKey(dateStr: string): string {
  const parsed = parseISO(dateStr);
  const weekNum = getISOWeek(parsed);
  const yearNum = getISOWeekYear(parsed);
  return `${yearNum}-W${String(weekNum).padStart(2, "0")}`;
}

export function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function diffInDays(dateA: string, dateB: string): number {
  return differenceInCalendarDays(parseISO(dateA), parseISO(dateB));
}

export function isYesterday(targetDate: string, today: string): boolean {
  return diffInDays(today, targetDate) === 1;
}

export function isToday(targetDate: string, today: string): boolean {
  return targetDate === today;
}

export function formatDateId(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEEE, d MMMM yyyy", { locale: id });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEEE, d MMM", { locale: id });
  } catch {
    return dateStr;
  }
}

export function formatDayMonth(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "d MMM", { locale: id });
  } catch {
    return dateStr;
  }
}

export function formatMonthName(monthKeyStr: string): string {
  try {
    const [year, month] = monthKeyStr.split("-");
    const parsed = new Date(Number(year), Number(month) - 1, 1);
    return format(parsed, "MMMM yyyy", { locale: id });
  } catch {
    return monthKeyStr;
  }
}

export function formatMonthShort(monthKeyStr: string): string {
  try {
    const [year, month] = monthKeyStr.split("-");
    const parsed = new Date(Number(year), Number(month) - 1, 1);
    return format(parsed, "MMM yyyy", { locale: id });
  } catch {
    return monthKeyStr;
  }
}

export function getPastDays(count: number, todayStr: string): string[] {
  const result: string[] = [];
  const base = parseISO(todayStr);
  for (let i = count - 1; i >= 0; i--) {
    result.push(format(subDays(base, i), "yyyy-MM-dd"));
  }
  return result;
}

export function getPastWeeks(
  count: number,
  todayStr: string
): { weekKey: string; label: string; start: string; end: string }[] {
  const result = [];
  const base = parseISO(todayStr);

  for (let i = count - 1; i >= 0; i--) {
    const target = subWeeks(base, i);
    const start = startOfISOWeek(target);
    const end = endOfISOWeek(target);
    const wKey = weekKey(format(start, "yyyy-MM-dd"));
    const label = `${format(start, "d MMM", { locale: id })} - ${format(
      end,
      "d MMM",
      { locale: id }
    )}`;

    result.push({
      weekKey: wKey,
      label,
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    });
  }
  return result;
}

export function getPastMonths(
  count: number,
  todayStr: string
): { monthKey: string; label: string; start: string; end: string }[] {
  const result = [];
  const base = parseISO(todayStr);

  for (let i = count - 1; i >= 0; i--) {
    const target = subMonths(base, i);
    const mKey = format(target, "yyyy-MM");
    const start = startOfMonth(target);
    const end = endOfMonth(target);
    const label = format(target, "MMM yyyy", { locale: id });

    result.push({
      monthKey: mKey,
      label,
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    });
  }
  return result;
}

export function getHeatmapDateRange(weeksCount: number = 20, todayStr: string) {
  const todayDate = parseISO(todayStr);
  const currentWeekEnd = endOfISOWeek(todayDate);
  const firstWeekStart = startOfISOWeek(subWeeks(todayDate, weeksCount - 1));

  return {
    startDate: format(firstWeekStart, "yyyy-MM-dd"),
    endDate: format(currentWeekEnd, "yyyy-MM-dd"),
  };
}

