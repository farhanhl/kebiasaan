"use client";

import React from "react";
import { XpBar } from "../gamification/XpBar";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";

interface LevelCardProps {
  xp: number;
}

export function LevelCard({ xp }: LevelCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-primary/10 p-5 shadow-soft md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display text-base font-bold text-fg">
            Level & XP Kamu
          </h4>
          <p className="text-xs text-muted">
            Konsistensi harian membuka lencana baru
          </p>
        </div>
        <Link
          href="/profil"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>Lihat Lencana</span>
          <HiChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <XpBar xp={xp} />
    </div>
  );
}

