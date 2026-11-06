"use client";

import React from "react";
import { DynamicChart as Chart } from "@/components/ui/DynamicChart";
import { colors } from "@/lib/theme";
import type { ApexOptions } from "apexcharts";

interface ShareDonutProps {
  goodCount: number;
  badCount: number;
  height?: number;
}

export function ShareDonut({
  goodCount,
  badCount,
  height = 240,
}: ShareDonutProps) {
  const total = goodCount + badCount;
  const series = total === 0 ? [1] : [goodCount, badCount];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "var(--font-sans), sans-serif",
    },
    colors: total === 0 ? [colors.border] : [colors.good, colors.bad],
    labels: total === 0 ? ["Belum ada data"] : ["Kebiasaan Baik", "Kebiasaan Buruk"],
    stroke: {
      show: true,
      colors: [colors.surface],
      width: 3,
    },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      labels: { colors: colors.fg },
      markers: { shape: "circle" },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Catatan",
              color: colors.muted,
              fontSize: "12px",
              fontFamily: "var(--font-sans), sans-serif",
              formatter: () => `${total}`,
            },
            value: {
              color: colors.fg,
              fontSize: "26px",
              fontWeight: 700,
              fontFamily: "var(--font-display), sans-serif",
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => (total === 0 ? "0" : `${val} kali`),
      },
    },
  };

  return (
    <div className="w-full flex justify-center">
      <Chart options={options} series={series} type="donut" height={height} />
    </div>
  );
}
