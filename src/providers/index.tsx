"use client";

import React from "react";
import { MotionProvider } from "./MotionProvider";
import { FlowbiteThemeClient } from "./FlowbiteThemeClient";
import { AuthProvider } from "./AuthProvider";
import { HabitsProvider } from "./HabitsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FlowbiteThemeClient>
      <MotionProvider>
        <AuthProvider>
          <HabitsProvider>{children}</HabitsProvider>
        </AuthProvider>
      </MotionProvider>
    </FlowbiteThemeClient>
  );
}
