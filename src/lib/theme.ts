export const colors = {
  primary: "#FB923C",
  primaryHover: "#F97316",
  secondary: "#F43F5E",
  accent: "#FACC15",
  bg: "#1C1917",
  surface: "#292524",
  surfaceRaised: "#342F2C",
  border: "#44403C",
  fg: "#FAFAF9",
  muted: "#A8A29E",
  onPrimary: "#1C1917",
  good: "#34D399",
  bad: "#F87171",
} as const;

export type ThemeColors = typeof colors;

