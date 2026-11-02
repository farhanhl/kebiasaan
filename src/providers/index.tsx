"use client";

import React from "react";
import { MotionProvider } from "./MotionProvider";
import { FlowbiteThemeClient } from "./FlowbiteThemeClient";
import { AuthProvider } from "./AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FlowbiteThemeClient>
      <MotionProvider>
        <AuthProvider>{children}</AuthProvider>
      </MotionProvider>
    </FlowbiteThemeClient>
  );
}
