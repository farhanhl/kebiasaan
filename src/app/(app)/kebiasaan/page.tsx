"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useHabits } from "@/hooks/useHabits";
import {
  createHabit,
  updateHabit,
  setHabitArchived,
  deleteHabit,
} from "@/lib/firebase/habits";
import type { Habit } from "@/types/habit";
import type { HabitFormInput } from "@/lib/schemas";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryChip } from "@/components/habits/CategoryChip";
import { HabitForm } from "@/components/habits/HabitForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { HabitCardSkeleton } from "@/components/ui/Skeletons";
import {
  Button,
  TextInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "flowbite-react";
import {
  HiPlus,
  HiPencil,
  HiArchiveBox,
  HiArchiveBoxArrowDown,
  HiTrash,
  HiMagnifyingGlass,
  HiChevronRight,
} from "react-icons/hi2";
import { todayKey } from "@/lib/date";
import { getEffectiveStreak, calcFreeDays } from "@/lib/gamification";

type FilterTab = "all" | "good" | "bad";

export default function KebiasaanPage() {
  const { user } = useAuth();
  const { habits, loading } = useHabits();
  const today = todayKey();

  const [filter, setFilter] = useState<FilterTab>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filtered habits
  const displayedHabits = habits.filter((h) => {
    // Archived toggle
    if (showArchived) {
      if (!h.isArchived) return false;
    } else {
      if (h.isArchived) return false;
    }

    // Category filter
    if (filter === "good" && h.category !== "good") return false;
    if (filter === "bad" && h.category !== "bad") return false;

    // Search query
    if (search.trim()) {
      return h.name.toLowerCase().includes(search.toLowerCase().trim());
    }

    return true;
  });

  const handleCreateOrUpdate = async (data: HabitFormInput) => {
    if (!user) return;
    if (editingHabit) {
      await updateHabit(user.uid, editingHabit.id, {
        name: data.name,
        emoji: data.emoji,
        note: data.note,
      });
      setEditingHabit(null);
    } else {
      await createHabit(user.uid, data);
    }
  };

  const handleArchiveToggle = async (habit: Habit) => {
    if (!user) return;
    await setHabitArchived(user.uid, habit.id, !habit.isArchived);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !deleteTarget) return;
    try {
      setDeleting(true);
      await deleteHabit(user.uid, deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const archivedCount = habits.filter((h) => h.isArchived).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Kebiasaan"
        subtitle="Kelola semua kebiasaan baik dan buruk yang ingin kamu pantau"
        action={
          <Button
            onClick={() => {
              setEditingHabit(null);
              setFormOpen(true);
            }}
            color="default"
            className="rounded-full shadow-glow font-semibold"
          >
            <HiPlus className="mr-1.5 h-4 w-4" />
            <span>Tambah Kebiasaan</span>
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setShowArchived(false);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              !showArchived && filter === "all"
                ? "bg-primary text-on-primary shadow-glow"
                : "text-muted hover:text-fg"
            }`}
          >
            Semua ({habits.filter((h) => !h.isArchived).length})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilter("good");
              setShowArchived(false);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              !showArchived && filter === "good"
                ? "bg-good text-on-primary shadow-glow"
                : "text-muted hover:text-fg"
            }`}
          >
            Baik ({habits.filter((h) => !h.isArchived && h.category === "good").length})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilter("bad");
              setShowArchived(false);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              !showArchived && filter === "bad"
                ? "bg-bad text-on-primary shadow-glow"
                : "text-muted hover:text-fg"
            }`}
          >
            Buruk ({habits.filter((h) => !h.isArchived && h.category === "bad").length})
          </button>
          {archivedCount > 0 && (
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                showArchived
                  ? "bg-muted text-on-primary"
                  : "text-muted hover:text-fg"
              }`}
            >
              Diarsipkan ({archivedCount})
            </button>
          )}
        </div>

        <div className="w-full sm:w-64">
          <TextInput
            placeholder="Cari kebiasaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={HiMagnifyingGlass}
          />
        </div>
      </div>

      {/* Habit List */}
      {loading ? (
        <div className="space-y-3">
          <HabitCardSkeleton />
          <HabitCardSkeleton />
          <HabitCardSkeleton />
        </div>
      ) : displayedHabits.length === 0 ? (
        <EmptyState
          icon={showArchived ? <HiArchiveBox className="h-7 w-7" /> : <HiPlus className="h-7 w-7" />}
          title={
            showArchived
              ? "Tidak ada kebiasaan yang diarsipkan"
              : search
              ? "Kebiasaan tidak ditemukan"
              : "Belum ada kebiasaan"
          }
          description={
            showArchived
              ? "Kebiasaan yang kamu arsipkan akan muncul di sini."
              : search
              ? `Tidak ada kebiasaan dengan kata kunci "${search}".`
              : "Yuk mulai catat satu kebiasaan kecil hari ini."
          }
          actionLabel={!showArchived && !search ? "Tambah Kebiasaan Baru" : undefined}
          onAction={() => {
            setEditingHabit(null);
            setFormOpen(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          {displayedHabits.map((habit) => {
            const isGood = habit.category === "good";
            const streak = isGood
              ? getEffectiveStreak(habit, today)
              : calcFreeDays(habit.startDate, habit.lastLogDate, today);

            return (
              <div
                key={habit.id}
                className={`flex flex-col gap-3 rounded-3xl border bg-surface p-4 shadow-soft transition-all sm:flex-row sm:items-center sm:justify-between ${
                  isGood ? "border-l-4 border-l-good border-border" : "border-l-4 border-l-bad border-border"
                } ${habit.isArchived ? "opacity-60" : "hover:border-primary/40"}`}
              >
                <Link
                  href={`/kebiasaan/${habit.id}`}
                  className="flex flex-1 items-center gap-3.5 group"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                      isGood ? "bg-good/15 text-good" : "bg-bad/15 text-bad"
                    }`}
                  >
                    {habit.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-display text-base font-bold text-fg group-hover:text-primary transition-colors">
                        {habit.name}
                      </h3>
                      <HiChevronRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <CategoryChip category={habit.category} />
                      <span className="text-muted">
                        Total: <strong className="text-fg">{habit.totalCount}</strong> kali
                      </span>
                      <span className="text-muted">·</span>
                      <span className={isGood ? "text-primary font-semibold" : "text-muted font-semibold"}>
                        {isGood
                          ? `${streak} hari streak`
                          : streak === 0
                          ? "Mulai lagi hari ini"
                          : `${streak} hari bebas`}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5 border-t border-border pt-2 sm:border-t-0 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingHabit(habit);
                      setFormOpen(true);
                    }}
                    title="Ubah Kebiasaan"
                    aria-label={`Ubah ${habit.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-raised hover:text-fg transition-colors cursor-pointer"
                  >
                    <HiPencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleArchiveToggle(habit)}
                    title={habit.isArchived ? "Aktifkan Kembali" : "Arsipkan"}
                    aria-label={habit.isArchived ? `Aktifkan ${habit.name}` : `Arsipkan ${habit.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-raised hover:text-fg transition-colors cursor-pointer"
                  >
                    {habit.isArchived ? (
                      <HiArchiveBoxArrowDown className="h-4 w-4 text-primary" />
                    ) : (
                      <HiArchiveBox className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(habit)}
                    title="Hapus Kebiasaan"
                    aria-label={`Hapus ${habit.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-bad/20 hover:text-bad transition-colors cursor-pointer"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Habit Form Modal */}
      <HabitForm
        show={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleCreateOrUpdate}
        habit={editingHabit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        size="sm"
      >
        <ModalHeader>Hapus Kebiasaan?</ModalHeader>
        <ModalBody className="space-y-3">
          <p className="text-sm text-fg">
            Yakin ingin menghapus kebiasaan{" "}
            <strong>&ldquo;{deleteTarget?.name}&rdquo;</strong>?
          </p>
          <div className="rounded-2xl border border-bad/30 bg-bad-soft p-3 text-xs text-bad">
            Semua catatan dan riwayat kebiasaan ini ikut terhapus dan nggak bisa dikembalikan.
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2 border-t border-border/60 p-4">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
            className="rounded-full border border-border/80 bg-surface/50 px-5 py-2 text-xs font-semibold text-muted hover:bg-surface hover:text-fg transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
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

