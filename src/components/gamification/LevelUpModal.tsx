"use client";

import React, { useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "flowbite-react";
import { HiTrophy } from "react-icons/hi2";
import { getLevelTitle } from "@/lib/gamification";
import { triggerLevelUpConfetti } from "@/lib/confetti";

interface LevelUpModalProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ show, level, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (show) {
      triggerLevelUpConfetti();
    }
  }, [show]);

  const title = getLevelTitle(level);

  return (
    <Modal show={show} onClose={onClose} size="sm">
      <ModalHeader className="text-center justify-center">
        Level Up!
      </ModalHeader>
      <ModalBody className="flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-secondary via-primary to-accent text-on-primary shadow-md">
          <HiTrophy className="h-8 w-8 text-on-primary" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-fg">
          Naik ke Level {level}!
        </h3>
        <p className="mt-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-display text-xs font-semibold text-primary">
          {title}
        </p>
        <p className="mt-3 text-xs text-muted max-w-xs">
          Konsistensimu terbukti menghasilkan hasil nyata. Terus pertahankan ritme santaimu!
        </p>
      </ModalBody>
      <ModalFooter className="flex justify-center border-t-0 p-5 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-primary px-6 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover focus:ring-4 focus:ring-primary/20 shadow-sm transition-all cursor-pointer"
        >
          Lanjut Berproses
        </button>
      </ModalFooter>
    </Modal>
  );
}

