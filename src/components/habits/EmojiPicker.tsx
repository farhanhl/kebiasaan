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
      <div className="grid grid-cols-8 gap-2 rounded-2xl border border-border/70 bg-surface/50 p-2.5 max-h-36 overflow-y-auto">
        {EMOJI_OPTIONS.map((emoji) => {
          const isSelected = selected === emoji;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelect(emoji)}
              aria-label={`Pilih emoji ${emoji}`}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xl transition-all cursor-pointer ${
                isSelected
                  ? "bg-surface border border-primary/60 text-fg ring-2 ring-primary/25 shadow-sm"
                  : "hover:bg-surface/70"
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

