"use client";

import React from "react";
import type { Mood } from "@/types/log";

const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: "happy", emoji: "😄", label: "Happy" },
  { id: "chill", emoji: "😌", label: "Chill" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "angry", emoji: "😤", label: "Angry" },
  { id: "tired", emoji: "😴", label: "Tired" },
];

interface MoodPickerProps {
  currentMood: Mood | null;
  onSelectMood: (mood: Mood | null) => Promise<void> | void;
}

export function MoodPicker({ currentMood, onSelectMood }: MoodPickerProps) {
  const handleClick = (mood: Mood) => {
    if (currentMood === mood) {
      onSelectMood(null);
    } else {
      onSelectMood(mood);
    }
  };

  return (
    <div className="flex items-center gap-1.5 pt-2">
      <span className="text-[11px] text-muted mr-1">Mood:</span>
      <div className="flex items-center gap-1">
        {MOODS.map((m) => {
          const isSelected = currentMood === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleClick(m.id)}
              aria-label={`Mood ${m.label}`}
              title={m.label}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm transition-all hover:scale-125 active:scale-90 ${
                isSelected
                  ? "bg-accent/25 ring-2 ring-accent scale-110 shadow-glow"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {m.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

