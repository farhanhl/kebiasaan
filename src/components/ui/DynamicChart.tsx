"use client";

import dynamic from "next/dynamic";

export const DynamicChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

