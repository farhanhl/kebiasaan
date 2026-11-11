"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { HiArrowDown, HiArrowPath } from "react-icons/hi2";

const PULL_THRESHOLD = 68; // Jarak tarik piksel untuk memicu refresh
const MAX_PULL = 90; // Batas maksimal tarikan visual

interface PullToRefreshProps {
  children?: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const isPullingRef = useRef(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPullDistance(54);

    try {
      // Haptic feedback getar singkat jika didukung browser
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(15);
        } catch {
          // ignore
        }
      }

      // 1. Cek update Service Worker / PWA
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update().catch(() => {});
        }
      }

      // 2. Jalankan callback custom jika disediakan
      if (onRefresh) {
        await onRefresh();
      }

      // Jeda visual singkat agar animasi memutar terlihat natural
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 3. Reload halaman agar semua state, tanggal, dan koneksi realtime tersinkronisasi bersih
      window.location.reload();
    } catch {
      window.location.reload();
    }
  }, [onRefresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let touchStartY = 0;
    let touchStartX = 0;
    let isTracking = false;

    const onTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;
      // Hanya mulai mendeteksi jika posisi scroll tepat di puncak (scrollY <= 0)
      if (window.scrollY <= 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isTracking = true;
      } else {
        isTracking = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTracking || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - touchStartY;
      const diffX = Math.abs(currentX - touchStartX);

      // Cek apakah tarikan ke arah bawah dan lebih dominan vertikal dibanding horizontal
      if (diffY > 0 && diffY > diffX && window.scrollY <= 0) {
        // Redam tarikan secara non-linear (efek elastis karet)
        const damped = Math.min(MAX_PULL, Math.pow(diffY, 0.82));
        setPullDistance(damped);
        setIsPulling(true);
        isPullingRef.current = true;
      } else if (diffY <= 0) {
        setPullDistance(0);
        setIsPulling(false);
        isPullingRef.current = false;
      }
    };

    const onTouchEnd = () => {
      if (!isTracking || isRefreshing) return;
      isTracking = false;

      setPullDistance((currentDistance) => {
        if (currentDistance >= PULL_THRESHOLD) {
          handleRefresh();
          return 54;
        } else {
          setIsPulling(false);
          isPullingRef.current = false;
          return 0;
        }
      });
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [isRefreshing, handleRefresh]);

  const isReady = pullDistance >= PULL_THRESHOLD;
  const progress = Math.min(1, pullDistance / PULL_THRESHOLD);
  const showIndicator = isPulling || isRefreshing;

  return (
    <>
      {/* Floating Pull-to-Refresh Pill Indicator */}
      <div
        className={`fixed left-1/2 z-50 -translate-x-1/2 pointer-events-none transition-all ${
          showIndicator ? "opacity-100" : "opacity-0 -translate-y-6"
        }`}
        style={{
          top: "calc(env(safe-area-inset-top, 0px) + 0.85rem)",
          transform: `translate(-50%, ${pullDistance}px) scale(${
            isRefreshing ? 1 : Math.min(1, 0.75 + progress * 0.25)
          })`,
          transition: isPulling
            ? "none"
            : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
        }}
      >
        <div className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/95 px-3.5 py-1.5 shadow-2xl backdrop-blur-xl text-fg text-xs font-semibold">
          {isRefreshing ? (
            <>
              <HiArrowPath className="h-4 w-4 animate-spin text-primary" />
              <span className="text-fg">Memperbarui...</span>
            </>
          ) : isReady ? (
            <>
              <HiArrowPath className="h-4 w-4 text-primary transition-transform duration-200 rotate-180" />
              <span className="text-primary font-bold">Lepaskan untuk refresh</span>
            </>
          ) : (
            <>
              <HiArrowDown
                className="h-4 w-4 text-muted transition-transform"
                style={{ transform: `rotate(${progress * 180}deg)` }}
              />
              <span className="text-muted">Tarik untuk refresh</span>
            </>
          )}
        </div>
      </div>

      {children}
    </>
  );
}
