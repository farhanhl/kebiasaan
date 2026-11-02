"use client";

import React from "react";
import { Button } from "flowbite-react";
import { HiSparkles } from "react-icons/hi2";

interface EmptyStateProps {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  emoji,
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 p-8 text-center sm:p-12 ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised text-primary border border-border">
        {icon ? (
          icon
        ) : emoji ? (
          <span className="text-2xl select-none" role="img" aria-hidden="true">
            {emoji}
          </span>
        ) : (
          <HiSparkles className="h-7 w-7" />
        )}
      </div>
      <h3 className="mb-2 text-xl font-bold font-display text-fg">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="rounded-full bg-primary font-semibold text-on-primary shadow-glow hover:bg-primary-hover focus:ring-4 focus:ring-primary/30"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
