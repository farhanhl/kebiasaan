import confetti from "canvas-confetti";
import { colors } from "./theme";

export function triggerConfetti() {
  if (typeof window === "undefined") return;

  // Check prefers-reduced-motion
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) {
    return;
  }

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: [colors.primary, colors.secondary, colors.accent, colors.good],
  });
}

export function triggerLevelUpConfetti() {
  if (typeof window === "undefined") return;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) return;

  // Double burst for level up
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.5 },
    colors: [colors.primary, colors.secondary, colors.accent, colors.good],
  });

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: [colors.primary, colors.accent],
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: [colors.secondary, colors.good],
    });
  }, 250);
}

