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

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi Bawah Layar"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-full border border-border bg-surface/90 p-2 shadow-soft backdrop-blur-md md:hidden"
      style={{
        paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/hari-ini" && pathname.startsWith(item.href));
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all ${
                isActive
                  ? "bg-primary text-on-primary font-bold shadow-glow"
                  : "text-muted hover:text-fg"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

