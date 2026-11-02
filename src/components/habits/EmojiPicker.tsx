"use client";

import React from "react";

const EMOJI_OPTIONS = [
  "🌱", "💧", "🏃", "📚", "🧘", "💤", "🍎", "☕",
  "🎨", "✍️", "🧹", "🏋️", "🥗", "🚴", "🎯", "🌅",
  "🍟", "📱", "🚬", "🎮", "🍕", "🍬", "🥱", "🛋️",
  "💸", "🍺", "🧁", "🍩", "🎬", "🛍️", "🥤", "😵",
];

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-muted">
        Pilih Emoji Ikon
      </label>
      <div className="grid grid-cols-8 gap-2 rounded-2xl border border-border bg-surface-raised/40 p-3 max-h-36 overflow-y-auto">
        {EMOJI_OPTIONS.map((emoji) => {
          const isSelected = selected === emoji;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelect(emoji)}
              aria-label={`Pilih emoji ${emoji}`}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
                isSelected
                  ? "bg-primary/20 border-2 border-primary shadow-glow scale-105"
                  : "hover:bg-surface-raised"
              }`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

