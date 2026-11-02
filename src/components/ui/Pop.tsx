"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import React from "react";

interface PopProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function Pop({ children, className = "", ...props }: PopProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

