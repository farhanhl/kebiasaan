"use client";

import React from "react";
import { ThemeProvider } from "flowbite-react";
import { flowbiteCustomTheme } from "@/lib/flowbite-theme";

export function FlowbiteThemeClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={flowbiteCustomTheme}>
      {children}
    </ThemeProvider>
  );
}
