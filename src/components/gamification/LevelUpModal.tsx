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
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-secondary via-primary to-accent text-on-primary shadow-glow animate-bounce">
          <HiTrophy className="h-10 w-10 text-on-primary" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-fg">
          Naik ke Level {level}!
        </h3>
        <p className="mt-1 rounded-full bg-primary/20 px-3 py-1 font-display text-sm font-semibold text-primary">
          {title}
        </p>
        <p className="mt-3 text-xs text-muted">
          Konsistensimu terbukti menghasilkan hasil nyata. Terus pertahankan ritme santaimu!
        </p>
      </ModalBody>
      <ModalFooter className="flex justify-center">
        <Button
          color="default"
          onClick={onClose}
          className="rounded-full shadow-glow font-semibold"
        >
          Lanjut Berproses
        </Button>
      </ModalFooter>
    </Modal>
  );
}

