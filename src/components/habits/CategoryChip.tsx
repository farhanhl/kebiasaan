import React from "react";
import type { HabitCategory } from "@/types/habit";

interface CategoryChipProps {
  category: HabitCategory;
  className?: string;
}

export function CategoryChip({ category, className = "" }: CategoryChipProps) {
  const isGood = category === "good";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isGood
          ? "bg-good/15 text-good border border-good/30"
          : "bg-bad/15 text-bad border border-bad/30"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isGood ? "bg-good" : "bg-bad"
        }`}
      />
      <span>{isGood ? "Kebiasaan Baik" : "Kebiasaan Buruk"}</span>
    </span>
  );
}
