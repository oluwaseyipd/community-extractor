"use client";
import { getMonthOptions } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface MonthFilterProps {
  dateCol: string | null;
  columns: string[];
  selectedDateCol: string;
  selectedMonth: string;
  onDateColChange: (col: string) => void;
  onMonthChange: (month: string) => void;
}

export function MonthFilter({
  dateCol,
  columns,
  selectedDateCol,
  selectedMonth,
  onDateColChange,
  onMonthChange,
}: MonthFilterProps) {
  const monthOptions = getMonthOptions();

  return (
    <div className="fade-up flex flex-col sm:flex-row gap-3">
      {/* Date column selector */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">
          Date Column
        </label>
        <div className="relative">
          <Calendar
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <select
            value={selectedDateCol}
            onChange={(e) => onDateColChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] appearance-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition-all"
          >
            <option value="">— Select date column —</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Month selector */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">
          Filter by Month
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          disabled={!selectedDateCol}
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] appearance-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
