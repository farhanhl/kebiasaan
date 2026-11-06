"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useHabits } from "@/hooks/useHabits";
import { useLogsRange } from "@/hooks/useLogsRange";
import { useToday } from "@/hooks/useToday";
import type { PeriodType } from "@/types/stats";
import { PageHeader } from "@/components/layout/PageHeader";
import { PeriodTabs } from "@/components/dashboard/PeriodTabs";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ShareDonut } from "@/components/dashboard/ShareDonut";
import { CalendarHeatmap } from "@/components/dashboard/CalendarHeatmap";
import { TopHabits } from "@/components/dashboard/TopHabits";
import { MoodSummary } from "@/components/dashboard/MoodSummary";
import { LevelCard } from "@/components/dashboard/LevelCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeletons";
import {
  aggregateSummary,
  aggregateTrend,
  aggregateTopHabits,
  aggregateMood,
  aggregateHeatmap,
  filterLogsByPeriod,
} from "@/lib/stats";
import {
  getHeatmapDateRange,
} from "@/lib/date";
import { parseISO, subMonths, format, startOfMonth, addDays } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const { habits, loading: habitsLoading } = useHabits();
  const { today } = useToday();

  const [period, setPeriod] = useState<PeriodType>("daily");

  // Calculate 6-month date range for fetching logs
  const { startDate, endDate } = useMemo(() => {
    const todayDate = parseISO(today);
    const heatmapRange = getHeatmapDateRange(20, today);
    const sixMonthsAgo = startOfMonth(subMonths(todayDate, 6));
    const startStr = format(sixMonthsAgo, "yyyy-MM-dd");

    const earliest = startStr < heatmapRange.startDate ? startStr : heatmapRange.startDate;

    return {
      startDate: earliest,
      endDate: heatmapRange.endDate,
    };
  }, [today]);

  const { logs, loading: logsLoading } = useLogsRange(startDate, endDate);

  // Compute period boundaries for current and previous
  const { currentLogs, prevLogs, periodLabel } = useMemo(() => {
    return filterLogsByPeriod(logs, period, today);
  }, [logs, period, today]);

  // Aggregated data
  const summary = useMemo(() => {
    const streak = profile?.dailyStreak || 0;
    return aggregateSummary(currentLogs, prevLogs, streak, streak);
  }, [currentLogs, prevLogs, profile]);

  const trendData = useMemo(() => {
    return aggregateTrend(logs, period, today);
  }, [logs, period, today]);

  const { topGood, topBad } = useMemo(() => {
    return aggregateTopHabits(currentLogs, habits);
  }, [currentLogs, habits]);

  const moodData = useMemo(() => {
    return aggregateMood(currentLogs);
  }, [currentLogs]);

  // Heatmap 20 weeks
  const { goodHeatmap, badHeatmap } = useMemo(() => {
    const heatmapRange = getHeatmapDateRange(20, today);
    const start = parseISO(heatmapRange.startDate);
    const totalDays = 20 * 7;
    const allDates: string[] = [];
    for (let i = 0; i < totalDays; i++) {
      allDates.push(format(addDays(start, i), "yyyy-MM-dd"));
    }

    return {
      goodHeatmap: aggregateHeatmap(logs, "good", allDates),
      badHeatmap: aggregateHeatmap(logs, "bad", allDates),
    };
  }, [logs, today]);

  const loading = habitsLoading || logsLoading;
  const hasNoData = !loading && logs.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Rekap"
        subtitle="Analisis kebiasaan harian, mingguan, dan bulanan kamu"
        action={
          <PeriodTabs currentPeriod={period} onChange={setPeriod} />
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : hasNoData ? (
        <EmptyState
          title="Belum ada catatan"
          description="Mulai catat kebiasaanmu di halaman Hari Ini agar grafik dan rekap statistikmu muncul di sini."
          actionLabel="Ke Hari Ini"
          onAction={() => router.push("/hari-ini")}
        />
      ) : (
        <>
          {/* 1. Summary Cards */}
          <SummaryCards summary={summary} periodLabel={periodLabel} />

          {/* 2. Charts Row: Trend & Donut */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartCard
                title={`Tren Kebiasaan (${period === "daily" ? "7 Hari" : period === "weekly" ? "8 Minggu" : "6 Bulan"})`}
                subtitle="Perbandingan kebiasaan baik vs buruk"
              >
                <TrendChart data={trendData} />
              </ChartCard>
            </div>

            <div>
              <ChartCard
                title="Porsi Keseimbangan"
                subtitle={`Persentase pada ${periodLabel === "kemarin" ? "hari ini" : periodLabel === "minggu lalu" ? "minggu ini" : "bulan ini"}`}
              >
                <ShareDonut
                  goodCount={summary.totalGood}
                  badCount={summary.totalBad}
                />
              </ChartCard>
            </div>
          </div>

          {/* 3. Heatmap */}
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft md:p-6">
            <CalendarHeatmap goodDays={goodHeatmap} badDays={badHeatmap} />
          </div>

          {/* 4. Top Habits & Mood Summary */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TopHabits topGood={topGood} topBad={topBad} />
            </div>
            <div>
              <MoodSummary moods={moodData} />
            </div>
          </div>

          {/* 5. Level Card */}
          <LevelCard xp={profile?.xp || 0} />
        </>
      )}
    </div>
  );
}
