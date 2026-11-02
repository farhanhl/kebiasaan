"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useHabits } from "@/hooks/useHabits";
import { useTodayLogs } from "@/hooks/useTodayLogs";
import { incrementLog, decrementLog, setMood } from "@/lib/firebase/logs";
import { createHabit } from "@/lib/firebase/habits";
import type { Habit } from "@/types/habit";
import type { Mood, LogResult } from "@/types/log";
import type { BadgeId } from "@/types/user";
import type { HabitFormInput } from "@/lib/schemas";
import { PageHeader } from "@/components/layout/PageHeader";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";
import { BadgeToast } from "@/components/gamification/BadgeToast";
import { EmptyState } from "@/components/ui/EmptyState";
import { HabitCardSkeleton } from "@/components/ui/Skeletons";
import { Button } from "flowbite-react";
import { HiPlus } from "react-icons/hi2";
import { formatDateId } from "@/lib/date";
import {
  getRandomGoodMessage,
  getRandomBadMessage,
  copy,
} from "@/lib/copy";
import { triggerConfetti } from "@/lib/confetti";

export default function HariIniPage() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { habits, loading: habitsLoading } = useHabits();
  const { today, weekKey, monthKey, logsByHabitId, loading: logsLoading } =
    useTodayLogs();

  const [formOpen, setFormOpen] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [newBadge, setNewBadge] = useState<BadgeId | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeHabits = habits.filter((h) => !h.isArchived);
  const goodHabits = activeHabits.filter((h) => h.category === "good");
  const badHabits = activeHabits.filter((h) => h.category === "bad");

  // Calculate totals for today
  let goodTodayTotal = 0;
  let badTodayTotal = 0;
  for (const h of goodHabits) {
    goodTodayTotal += logsByHabitId.get(h.id)?.count || 0;
  }
  for (const h of badHabits) {
    badTodayTotal += logsByHabitId.get(h.id)?.count || 0;
  }

  // Check for perfect day
  useEffect(() => {
    if (goodHabits.length > 0 && !logsLoading) {
      const allDone = goodHabits.every(
        (h) => (logsByHabitId.get(h.id)?.count || 0) >= 1
      );
      if (allDone) {
        const key = `perfect_day_${today}`;
        const alreadyCelebrated = sessionStorage.getItem(key);
        if (!alreadyCelebrated) {
          sessionStorage.setItem(key, "true");
          triggerConfetti();
          setTimeout(() => {
            setToastMessage(copy.perfectDay);
          }, 0);
        }
      }
    }
  }, [goodHabits, logsByHabitId, logsLoading, today]);

  const handleIncrement = async (habit: Habit) => {
    if (!user) return;
    try {
      const result: LogResult = await incrementLog(user.uid, habit, {
        date: today,
        weekKey,
        monthKey,
      });

      if (habit.category === "good") {
        setToastMessage(getRandomGoodMessage());
      } else {
        setToastMessage(getRandomBadMessage());
      }

      if (result.levelUp) {
        setLevelUpLevel(profile ? profile.level + 1 : 2);
      }

      if (result.newBadges && result.newBadges.length > 0) {
        setNewBadge(result.newBadges[0]);
      }
    } catch (err) {
      console.error("increment error:", err);
      setToastMessage(copy.errorGeneral);
    }
  };

  const handleDecrement = async (habit: Habit) => {
    if (!user) return;
    try {
      await decrementLog(user.uid, habit, {
        date: today,
        weekKey,
        monthKey,
      });
    } catch (err) {
      console.error("decrement error:", err);
    }
  };

  const handleSetMood = async (habit: Habit, mood: Mood | null) => {
    if (!user) return;
    try {
      await setMood(user.uid, habit, today, mood);
    } catch (err) {
      console.error("setMood error:", err);
    }
  };

  const handleCreateHabit = async (data: HabitFormInput) => {
    if (!user) return;
    await createHabit(user.uid, data);
  };

  const displayName = profile?.displayName || user?.displayName || "Teman";
  const dateStr = formatDateId(today);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Hai, ${displayName}!`}
        subtitle={`${dateStr} · Bagaimana harimu?`}
        badges={
          <div className="flex items-center gap-2">
            <StreakBadge streak={profile?.dailyStreak || 0} />
            <span className="rounded-full border border-accent/30 bg-accent/15 px-3 py-1 font-display text-xs font-bold text-accent shadow-glow">
              Level {profile?.level || 1}
            </span>
          </div>
        }
        action={
          <Button
            onClick={() => setFormOpen(true)}
            color="default"
            className="rounded-full shadow-glow font-semibold"
          >
            <HiPlus className="mr-1.5 h-4 w-4" />
            <span>Tambah Kebiasaan</span>
          </Button>
        }
      />

      {/* Daily Progress summary pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-raised/40 p-3.5 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-fg">
            <span className="h-2.5 w-2.5 rounded-full bg-good shadow-glow" />
            Baik hari ini: <strong className="text-good">{goodTodayTotal}</strong> kali
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5 font-medium text-fg">
            <span className="h-2.5 w-2.5 rounded-full bg-bad shadow-glow" />
            Buruk hari ini: <strong className="text-bad">{badTodayTotal}</strong> kali
          </span>
        </div>
        <span className="text-muted">
          XP: <strong className="text-accent">{profile?.xp || 0} XP</strong>
        </span>
      </div>

      {/* Floating feedback message toast */}
      {toastMessage && (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center text-xs font-medium text-fg animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Habit Cards */}
      {habitsLoading || logsLoading ? (
        <div className="space-y-3">
          <HabitCardSkeleton />
          <HabitCardSkeleton />
        </div>
      ) : activeHabits.length === 0 ? (
        <EmptyState
          title="Belum ada kebiasaan aktif"
          description="Yuk mulai dari satu kebiasaan kecil hari ini. Misalnya minum air atau membaca 5 halaman."
          actionLabel="Tambah Kebiasaan Pertama"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {/* Good Habits Section */}
          {goodHabits.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-good shadow-glow" />
                <h2 className="font-display text-base font-bold text-fg">
                  Kebiasaan Baik
                </h2>
                <span className="rounded-full bg-good/15 px-2 py-0.5 text-[10px] font-bold text-good">
                  {goodHabits.length}
                </span>
              </div>
              <div className="space-y-3">
                {goodHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    today={today}
                    todayLog={logsByHabitId.get(habit.id)}
                    onIncrement={() => handleIncrement(habit)}
                    onDecrement={() => handleDecrement(habit)}
                    onSetMood={(mood) => handleSetMood(habit, mood)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bad Habits Section */}
          {badHabits.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-bad shadow-glow" />
                <h2 className="font-display text-base font-bold text-fg">
                  Kebiasaan Buruk
                </h2>
                <span className="rounded-full bg-bad/15 px-2 py-0.5 text-[10px] font-bold text-bad">
                  {badHabits.length}
                </span>
              </div>
              <div className="space-y-3">
                {badHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    today={today}
                    todayLog={logsByHabitId.get(habit.id)}
                    onIncrement={() => handleIncrement(habit)}
                    onDecrement={() => handleDecrement(habit)}
                    onSetMood={(mood) => handleSetMood(habit, mood)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Habit Form Modal */}
      <HabitForm
        show={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateHabit}
      />

      {/* Level Up Celebratory Modal */}
      <LevelUpModal
        show={Boolean(levelUpLevel)}
        level={levelUpLevel || 1}
        onClose={() => setLevelUpLevel(null)}
      />

      {/* Badge Toast */}
      <BadgeToast badgeId={newBadge} onClose={() => setNewBadge(null)} />
    </div>
  );
}
