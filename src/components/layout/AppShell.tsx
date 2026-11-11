"use client";

import React from "react";
import { SidebarNav } from "./SidebarNav";
import { BottomNav } from "./BottomNav";
import { BlobBackground } from "../ui/BlobBackground";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <BlobBackground />
      <div
        className="mx-auto flex max-w-7xl gap-6 px-4 pb-4 md:p-6"
        style={{
          paddingTop: "max(1.25rem, calc(env(safe-area-inset-top, 0px) + 1.25rem))",
          paddingLeft: "max(1rem, calc(env(safe-area-inset-left, 0px) + 1rem))",
          paddingRight: "max(1rem, calc(env(safe-area-inset-right, 0px) + 1rem))",
        }}
      >
        <SidebarNav />
        <main className="flex-1 w-full min-w-0 pb-32 md:pb-12">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

