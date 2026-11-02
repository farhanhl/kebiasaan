"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { logoutUser } from "@/lib/firebase/auth";
import { updateDisplayName } from "@/lib/firebase/users";
import { PageHeader } from "@/components/layout/PageHeader";
import { XpBar } from "@/components/gamification/XpBar";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
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
  HiPencil,
  HiArrowRightOnRectangle,
  HiFire,
  HiTrophy,
  HiCheckCircle,
} from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const router = useRouter();

  const [editNameOpen, setEditNameOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = profile?.displayName || user?.displayName || "Teman";
  const email = profile?.email || user?.email || "-";
  const xp = profile?.xp || 0;
  const initial = displayName.charAt(0).toUpperCase();

  const handleOpenEditName = () => {
    setNewName(displayName);
    setEditNameOpen(true);
  };

  const handleSaveName = async () => {
    if (!user || !newName.trim()) return;
    try {
      setSavingName(true);
      await updateDisplayName(user.uid, newName.trim());
      setEditNameOpen(false);
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      router.replace("/masuk");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil & Progres"
        subtitle="Pantau pencapaian, level, dan koleksi lencanamu"
      />

      {/* User Card */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-secondary via-primary to-accent font-display text-2xl font-bold text-on-primary shadow-glow">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-fg">
                {displayName}
              </h2>
              <button
                type="button"
                onClick={handleOpenEditName}
                aria-label="Ubah nama tampilan"
                className="rounded-full p-1 text-muted hover:bg-surface-raised hover:text-fg transition-colors cursor-pointer"
              >
                <HiPencil className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted">{email}</p>
          </div>
        </div>

        <Button
          color="alternative"
          onClick={() => setLogoutConfirmOpen(true)}
          className="rounded-full self-start sm:self-auto text-xs"
        >
          <HiArrowRightOnRectangle className="mr-1.5 h-4 w-4 text-bad" />
          <span>Keluar Akun</span>
        </Button>
      </div>

      {/* Level & XP Card */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-primary/10 p-5 shadow-soft md:p-6 space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-fg">
            Status Level & XP
          </h3>
          <p className="text-xs text-muted">
            Kumpulkan XP dengan konsisten mencatat kebiasaan baik setiap hari.
          </p>
        </div>

        <XpBar xp={xp} />

        <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-surface/70 p-3 text-center">
            <span className="block text-xs text-muted">Daily Streak</span>
            <span className="inline-flex items-center justify-center gap-1.5 font-display text-xl font-bold text-primary">
              <HiFire className="h-5 w-5 text-primary" />
              <span>{profile?.dailyStreak || 0} hari</span>
            </span>
          </div>
          <div className="rounded-2xl border border-border/60 bg-surface/70 p-3 text-center">
            <span className="block text-xs text-muted">Rekor Streak</span>
            <span className="inline-flex items-center justify-center gap-1.5 font-display text-xl font-bold text-fg">
              <HiTrophy className="h-5 w-5 text-accent" />
              <span>{profile?.longestDailyStreak || 0} hari</span>
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/60 bg-surface/70 p-3 text-center">
            <span className="block text-xs text-muted">Total Log Baik</span>
            <span className="inline-flex items-center justify-center gap-1.5 font-display text-xl font-bold text-good">
              <HiCheckCircle className="h-5 w-5 text-good" />
              <span>{profile?.totalGoodLogs || 0}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-fg">
            Koleksi Lencana (Badges)
          </h3>
          <p className="text-xs text-muted">
            Buka lencana unik dengan konsistensi dan hari bebas kebiasaan buruk.
          </p>
        </div>

        <BadgeGrid unlockedBadges={profile?.badges || {}} />
      </div>

      {/* Edit Name Modal */}
      <Modal show={editNameOpen} onClose={() => setEditNameOpen(false)} size="sm">
        <ModalHeader>Ubah Nama Tampilan</ModalHeader>
        <ModalBody className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Nama Panggilan
            </label>
            <TextInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama panggilan kamu"
              maxLength={30}
            />
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2 border-t border-border/60 p-4">
          <button
            type="button"
            onClick={() => setEditNameOpen(false)}
            disabled={savingName}
            className="rounded-full border border-border/80 bg-surface-raised/40 px-5 py-2 text-xs font-semibold text-muted hover:bg-surface-raised hover:text-fg transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveName}
            disabled={savingName || !newName.trim()}
            className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover focus:ring-4 focus:ring-primary/20 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingName ? <Spinner size="sm" /> : "Simpan"}
          </button>
        </ModalFooter>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        show={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        size="sm"
      >
        <ModalHeader>Keluar Akun?</ModalHeader>
        <ModalBody>
          <p className="text-sm text-fg">
            Kamu yakin ingin keluar dari akun Kebiasaan?
          </p>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2 border-t border-border/60 p-4">
          <button
            type="button"
            onClick={() => setLogoutConfirmOpen(false)}
            disabled={loggingOut}
            className="rounded-full border border-border/80 bg-surface-raised/40 px-5 py-2 text-xs font-semibold text-muted hover:bg-surface-raised hover:text-fg transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-full bg-bad px-5 py-2 text-xs font-semibold text-on-primary hover:bg-bad/90 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? <Spinner size="sm" /> : "Keluar"}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
