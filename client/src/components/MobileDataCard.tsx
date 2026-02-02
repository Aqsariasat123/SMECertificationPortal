'use client';

import React from 'react';

interface DataRow {
  label: string;
  value: React.ReactNode;
}

interface MobileDataCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  rows: DataRow[];
  actions?: React.ReactNode;
  onClick?: () => void;
}

export default function MobileDataCard({
  title,
  subtitle,
  badge,
  rows,
  actions,
  onClick,
}: MobileDataCardProps) {
  return (
    <div
      className="mobile-card cursor-pointer active:bg-gray-50"
      onClick={onClick}
    >
      <div className="mobile-card-header">
        <div className="flex-1 min-w-0">
          <h3 className="mobile-card-title truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        {badge && <div className="ml-2 flex-shrink-0">{badge}</div>}
      </div>

      {rows.map((row, index) => (
        <div key={index} className="mobile-card-row">
          <span className="mobile-card-label">{row.label}</span>
          <span className="mobile-card-value">{row.value}</span>
        </div>
      ))}

      {actions && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

// Helper component for mobile-only list wrapper
export function MobileCardList({ children }: { children: React.ReactNode }) {
  return <div className="mobile-card-list space-y-3">{children}</div>;
}

// Helper component for responsive table/card container
export function ResponsiveDataView({
  table,
  cards,
}: {
  table: React.ReactNode;
  cards: React.ReactNode;
}) {
  return (
    <>
      {/* Desktop: Show table */}
      <div className="hidden md:block">{table}</div>

      {/* Mobile: Show cards */}
      <div className="md:hidden">{cards}</div>
    </>
  );
}
