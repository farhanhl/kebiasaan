"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { TrendItem } from "@/types/stats";
import { colors } from "@/lib/theme";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TrendChartProps {
  data: TrendItem[];
  height?: number;
}

export function TrendChart({ data, height = 280 }: TrendChartProps) {
  const categories = data.map((d) => d.label);
  const goodSeries = data.map((d) => d.good);
  const badSeries = data.map((d) => d.bad);

  const series = [
    { name: "Kebiasaan Baik", data: goodSeries },
    { name: "Kebiasaan Buruk", data: badSeries },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "var(--font-sans), sans-serif",
    },
    colors: [colors.good, colors.bad],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories,
      labels: {
        style: { colors: colors.muted, fontSize: "11px" },
      },
      axisBorder: { color: colors.border },
      axisTicks: { color: colors.border },
    },
    yaxis: {
      labels: {
        style: { colors: colors.muted, fontSize: "11px" },
      },
    },
    grid: {
      borderColor: colors.border,
      strokeDashArray: 4,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: { colors: colors.fg },
      markers: { shape: "circle" },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" },
    },
  };

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="bar" height={height} />
    </div>
  );
}
