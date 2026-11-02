"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { BadgeId } from "@/types/user";
import { badgeMeta } from "@/lib/copy";
import { triggerConfetti } from "@/lib/confetti";

interface BadgeToastProps {
  badgeId: BadgeId | null;
  onClose: () => void;
}

export function BadgeToast({ badgeId, onClose }: BadgeToastProps) {
  useEffect(() => {
    if (badgeId) {
      triggerConfetti();
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badgeId, onClose]);

  if (!badgeId) return null;

  const meta = badgeMeta[badgeId];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className="fixed top-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-primary/40 bg-surface/95 p-4 shadow-glow backdrop-blur-md"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-2xl shadow-glow">
          {meta.emoji}
        </span>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Lencana Baru Terbuka!
          </p>
          <h4 className="font-display text-sm font-bold text-fg">{meta.name}</h4>
          <p className="text-xs text-muted">+{meta.xp} XP bonus ditambahkan</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="text-muted hover:text-fg text-sm"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

