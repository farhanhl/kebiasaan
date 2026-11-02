"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HiPlus, HiMinus } from "react-icons/hi2";
import type { HabitCategory } from "@/types/habit";

interface CounterButtonProps {
  count: number;
  category: HabitCategory;
  onIncrement: () => Promise<void> | void;
  onDecrement: () => Promise<void> | void;
  disabled?: boolean;
}

export function CounterButton({
  count,
  category,
  onIncrement,
  onDecrement,
  disabled = false,
}: CounterButtonProps) {
  const isGood = category === "good";
  const [floatingTexts, setFloatingTexts] = useState<{ id: number }[]>([]);

  const handleIncrement = () => {
    if (disabled) return;
    const newId = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id: newId }]);
    onIncrement();
  };

  const handleFloatingComplete = (id: number) => {
    setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Decrement Button */}
      <button
        type="button"
        onClick={onDecrement}
        disabled={count <= 0 || disabled}
        aria-label="Kurangi satu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-all hover:bg-surface-raised hover:text-fg active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <HiMinus className="h-4 w-4" />
      </button>

      {/* Count Display */}
      <div
        aria-live="polite"
        className="flex min-w-[2.5rem] items-center justify-center font-display text-2xl font-bold tabular-nums text-fg"
      >
        <motion.span
          key={count}
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          {count}
        </motion.span>
      </div>

      {/* Increment Button */}
      <div className="relative">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={handleIncrement}
          disabled={disabled || count >= 999}
          aria-label="Tambah satu"
          className={`relative flex h-12 w-12 items-center justify-center rounded-full font-bold shadow-glow transition-all ${
            isGood
              ? "bg-primary text-on-primary hover:bg-primary-hover focus:ring-4 focus:ring-primary/40"
              : "border border-bad/30 bg-bad/15 text-bad hover:bg-bad/25 focus:ring-4 focus:ring-bad/40"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <HiPlus className="h-6 w-6" />
        </motion.button>

        {/* Floating +1 animation */}
        <AnimatePresence>
          {floatingTexts.map((item) => (
            <motion.span
              key={item.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -36, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationComplete={() => handleFloatingComplete(item.id)}
              className={`pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 font-display text-sm font-bold ${
                isGood ? "text-primary" : "text-bad"
              }`}
            >
              +1
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

