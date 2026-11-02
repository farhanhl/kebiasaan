"use client";

import React from "react";
import { SidebarNav } from "./SidebarNav";
import { BottomNav } from "./BottomNav";
import { BlobBackground } from "../ui/BlobBackground";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <BlobBackground />
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <SidebarNav />
        <main className="flex-1 w-full min-w-0 pb-28 md:pb-12">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

