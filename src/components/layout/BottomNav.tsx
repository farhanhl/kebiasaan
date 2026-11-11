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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-surface/95 shadow-soft backdrop-blur-xl md:hidden"
      style={{
        paddingBottom: "max(0.625rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pt-2">
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
              className="group flex flex-1 flex-col items-center justify-center py-1 transition-transform active:scale-95"
            >
              <div
                className={`relative flex h-8 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-primary/20 text-primary shadow-glow"
                    : "text-muted group-hover:text-fg"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
              </div>
              <span
                className={`mt-1 text-[11px] tracking-tight transition-colors duration-200 ${
                  isActive
                    ? "font-bold text-primary"
                    : "font-medium text-muted group-hover:text-fg"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

