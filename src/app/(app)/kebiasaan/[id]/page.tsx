"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useHabits } from "@/hooks/useHabits";
import {
  updateHabit,
  setHabitArchived,
  deleteHabit,
} from "@/lib/firebase/habits";
import { subscribeHabitLogs } from "@/lib/firebase/logs";
import type { HabitLog } from "@/types/log";
import type { HabitFormInput } from "@/lib/schemas";
import { CategoryChip } from "@/components/habits/CategoryChip";
import { HabitForm } from "@/components/habits/HabitForm";
import { ChartCard } from "@/components/ui/ChartCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeletons";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "flowbite-react";
import {
  HiPencil,
  HiArchiveBox,
  HiArchiveBoxArrowDown,
  HiTrash,
  HiArrowLeft,
  HiMagnifyingGlass,
} from "react-icons/hi2";
import { todayKey, formatDateId, getPastDays, formatDateShort } from "@/lib/date";
import { getEffectiveStreak, calcFreeDays } from "@/lib/gamification";
import { colors } from "@/lib/theme";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import Link from "next/link";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function HabitDetailPage() {
  const params = useParams();
  const habitId = params?.id as string;
  const router = useRouter();

  const { user } = useAuth();
  const { habits, loading: habitsLoading } = useHabits();
  const today = todayKey();

  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const habit = habits.find((h) => h.id === habitId);

  useEffect(() => {
    if (!user || !habitId) return;

    const unsubscribe = subscribeHabitLogs(
      user.uid,
      habitId,
      60,
      (data) => {
        setLogs(data);
        setLogsLoading(false);
      },
      () => setLogsLoading(false)
    );

    return () => unsubscribe();
  }, [user, habitId]);

  // 30 days chart data
  const chartData = useMemo(() => {
    const days = getPastDays(30, today);
    const countMap = new Map<string, number>();
    for (const l of logs) {
      countMap.set(l.date, l.count);
    }
    return days.map((d) => ({
      date: d,
      label: formatDateShort(d),
      count: countMap.get(d) || 0,
    }));
  }, [logs, today]);

  // Average per active day
  const avgPerActiveDay = useMemo(() => {
    if (logs.length === 0) return 0;
    const total = logs.reduce((acc, l) => acc + l.count, 0);
    return Math.round((total / logs.length) * 10) / 10;
  }, [logs]);

  if (habitsLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="space-y-6">
        <Link
          href="/kebiasaan"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg"
        >
          <HiArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar Kebiasaan</span>
        </Link>
        <EmptyState
          icon={<HiMagnifyingGlass className="h-7 w-7 text-muted" />}
          title="Kebiasaan Tidak Ditemukan"
          description="Kebiasaan ini mungkin sudah dihapus atau tautan tidak valid."
          actionLabel="Kembali ke Kebiasaan"
          onAction={() => router.push("/kebiasaan")}
        />
      </div>
    );
  }

  const isGood = habit.category === "good";
  const streak = isGood
    ? getEffectiveStreak(habit, today)
    : calcFreeDays(habit.startDate, habit.lastLogDate, today);

  const handleEditSubmit = async (data: HabitFormInput) => {
    if (!user) return;
    await updateHabit(user.uid, habit.id, {
      name: data.name,
      emoji: data.emoji,
      note: data.note,
    });
  };

  const handleArchive = async () => {
    if (!user) return;
    await setHabitArchived(user.uid, habit.id, !habit.isArchived);
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      setDeleting(true);
      await deleteHabit(user.uid, habit.id);
      router.replace("/kebiasaan");
    } finally {
      setDeleting(false);
    }
  };

  // ApexChart options for 30 days
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "var(--font-sans), sans-serif",
    },
    colors: [isGood ? colors.good : colors.bad],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.map((d) => d.label),
      labels: {
        rotate: -45,
        style: { colors: colors.muted, fontSize: "10px" },
      },
      axisBorder: { color: colors.border },
    },
    yaxis: {
      labels: {
        style: { colors: colors.muted, fontSize: "11px" },
      },
    },
    grid: {
      borderColor: colors.border,
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${val} kali`,
      },
    },
  };

  const series = [{ name: habit.name, data: chartData.map((d) => d.count) }];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/kebiasaan"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
      >
        <HiArrowLeft className="h-4 w-4" />
        <span>Kembali ke Daftar Kebiasaan</span>
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-3xl shadow-glow ${
              isGood ? "bg-good/15 text-good" : "bg-bad/15 text-bad"
            }`}
          >
            {habit.emoji}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-fg">
                {habit.name}
              </h1>
              <CategoryChip category={habit.category} />
              {habit.isArchived && (
                <span className="rounded-full bg-surface-raised px-2.5 py-0.5 text-xs text-muted">
                  Diarsipkan
                </span>
              )}
            </div>
            {habit.note && (
              <p className="mt-1 text-xs text-muted">{habit.note}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            color="alternative"
            onClick={() => setEditOpen(true)}
            className="rounded-full text-xs"
          >
            <HiPencil className="mr-1 h-3.5 w-3.5" />
            <span>Ubah</span>
          </Button>

          <Button
            color="alternative"
            onClick={handleArchive}
            className="rounded-full text-xs"
          >
            {habit.isArchived ? (
              <>
                <HiArchiveBoxArrowDown className="mr-1 h-3.5 w-3.5 text-primary" />
                <span>Aktifkan</span>
              </>
            ) : (
              <>
                <HiArchiveBox className="mr-1 h-3.5 w-3.5" />
                <span>Arsipkan</span>
              </>
            )}
          </Button>

          <Button
            color="alternative"
            onClick={() => setDeleteConfirmOpen(true)}
            className="rounded-full text-xs hover:border-bad/50 hover:text-bad"
          >
            <HiTrash className="mr-1 h-3.5 w-3.5 text-bad" />
            <span>Hapus</span>
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
          <span className="text-xs text-muted">Total Hitungan</span>
          <span className="mt-1 block font-display text-2xl font-bold text-fg sm:text-3xl">
            {habit.totalCount} <span className="text-xs font-normal text-muted">kali</span>
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
          <span className="text-xs text-muted">
            {isGood ? "Streak Saat Ini" : "Hari Bebas Saat Ini"}
          </span>
          <span className={`mt-1 block font-display text-2xl font-bold sm:text-3xl ${isGood ? "text-primary" : "text-fg"}`}>
            {streak} <span className="text-xs font-normal text-muted">hari</span>
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
          <span className="text-xs text-muted">
            {isGood ? "Rekor Streak" : "Rekor Hari Bebas"}
          </span>
          <span className="mt-1 block font-display text-2xl font-bold text-accent sm:text-3xl">
            {habit.longestStreak} <span className="text-xs font-normal text-muted">hari</span>
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
          <span className="text-xs text-muted">Rata-rata / Hari Aktif</span>
          <span className="mt-1 block font-display text-2xl font-bold text-fg sm:text-3xl">
            {avgPerActiveDay} <span className="text-xs font-normal text-muted">kali/hari</span>
          </span>
        </div>
      </div>

      {/* 30 Days Chart */}
      <ChartCard
        title="Aktivitas 30 Hari Terakhir"
        subtitle="Jumlah hitungan per hari dalam 30 hari ke belakang"
        loading={logsLoading}
      >
        <Chart options={chartOptions} series={series} type="bar" height={260} />
      </ChartCard>

      {/* Log History */}
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft md:p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-fg">
          Riwayat Catatan (Maks. 60 Terakhir)
        </h3>

        {logs.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted">
            Belum ada riwayat catatan untuk kebiasaan ini.
          </p>
        ) : (
          <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-3 text-xs"
              >
                <div>
                  <span className="font-semibold text-fg">
                    {formatDateId(log.date)}
                  </span>
                  <span className="ml-2 text-muted">
                    (Minggu {log.weekKey.slice(5)})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {log.mood && (
                    <span className="text-base" title={`Mood: ${log.mood}`}>
                      {log.mood === "happy"
                        ? "😄"
                        : log.mood === "chill"
                        ? "😌"
                        : log.mood === "sad"
                        ? "😔"
                        : log.mood === "angry"
                        ? "😤"
                        : "😴"}
                    </span>
                  )}
                  <span className="rounded-full bg-surface-raised px-2.5 py-1 font-display font-bold text-fg tabular-nums">
                    {log.count} kali
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      <HabitForm
        show={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        habit={habit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        size="sm"
      >
        <ModalHeader>Hapus Kebiasaan?</ModalHeader>
        <ModalBody className="space-y-3">
          <p className="text-sm text-fg">
            Yakin ingin menghapus kebiasaan <strong>&ldquo;{habit.name}&rdquo;</strong>?
          </p>
          <div className="rounded-2xl border border-bad/30 bg-bad-soft p-3 text-xs text-bad">
            Semua catatan kebiasaan ini ikut terhapus dan nggak bisa dikembalikan.
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2 border-t border-border/60 p-4">
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={deleting}
            className="rounded-full border border-border/80 bg-surface/50 px-5 py-2 text-xs font-semibold text-muted hover:bg-surface hover:text-fg transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full bg-bad px-5 py-2 text-xs font-semibold text-on-primary hover:bg-bad/90 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <div className="flex items-center gap-1.5">
                <Spinner size="sm" />
                <span>Menghapus...</span>
              </div>
            ) : (
              "Ya, Hapus"
            )}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

