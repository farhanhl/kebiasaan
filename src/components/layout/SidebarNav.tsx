"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiSun,
  HiOutlineSun,
  HiClipboardDocumentList,
  HiOutlineClipboardDocumentList,
  HiChartBar,
  HiOutlineChartBar,
  HiUser,
  HiOutlineUser,
} from "react-icons/hi2";

const navItems = [
  {
    href: "/hari-ini",
    label: "Hari Ini",
    icon: HiOutlineSun,
    activeIcon: HiSun,
  },
  {
    href: "/kebiasaan",
    label: "Kebiasaan",
    icon: HiOutlineClipboardDocumentList,
    activeIcon: HiClipboardDocumentList,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: HiOutlineChartBar,
    activeIcon: HiChartBar,
  },
  {
    href: "/profil",
    label: "Profil",
    icon: HiOutlineUser,
    activeIcon: HiUser,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navigasi Utama"
      className="hidden md:flex flex-col justify-between w-64 shrink-0 rounded-3xl border border-border bg-surface p-5 shadow-soft min-h-[calc(100vh-2.5rem)] sticky top-5"
    >
      <div className="space-y-6">
        <Link
          href="/hari-ini"
          className="flex items-center gap-3 px-3 py-2 transition-transform hover:scale-[1.02]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-secondary via-primary to-accent shadow-glow text-on-primary">
            <HiSun className="h-6 w-6" />
          </span>
          <div>
            <span className="block font-display text-xl font-bold tracking-tight text-fg">
              Kebiasaan
            </span>
            <span className="block text-[11px] text-muted">Habit Tracker</span>
          </div>
        </Link>

        <nav className="space-y-1.5" aria-label="Menu Aplikasi">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/hari-ini" && pathname.startsWith(item.href));
            const Icon = isActive ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-on-primary font-semibold shadow-glow"
                    : "text-muted hover:bg-surface-raised hover:text-fg"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl border border-border bg-surface-raised/40 p-3 text-xs text-muted">
        <p className="font-semibold text-fg">Konsisten tiap hari</p>
        <p className="mt-0.5 text-[11px]">Satu langkah kecil yang berkelanjutan.</p>
      </div>
    </aside>
  );
}
