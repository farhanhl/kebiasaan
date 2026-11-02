import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badges?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  badges,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 pb-4 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div>
        <h1 className="text-2xl font-bold font-display text-fg sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted capitalize-first">{subtitle}</p>
        )}
      </div>

      {(badges || action) && (
        <div className="flex flex-wrap items-center gap-2">
          {badges}
          {action}
        </div>
      )}
    </div>
  );
}

