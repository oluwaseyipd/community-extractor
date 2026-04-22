"use client";
import { cn } from "@/lib/utils";
import { CheckSquare, Square, Eye, EyeOff } from "lucide-react";

interface ColumnTogglerProps {
  columns: string[];
  selected: Set<string>;
  dateCol: string | null;
  nameCol: string | null;
  onChange: (col: string, checked: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function ColumnToggler({
  columns,
  selected,
  dateCol,
  nameCol,
  onChange,
  onSelectAll,
  onDeselectAll,
}: ColumnTogglerProps) {
  const allSelected = columns.every((c) => selected.has(c));

  return (
    <div className="fade-up">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[var(--color-text)] text-sm">
            Select Columns
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {selected.size} of {columns.length} selected
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
          >
            <Eye size={12} />
            All
          </button>
          <button
            onClick={onDeselectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-colors"
          >
            <EyeOff size={12} />
            None
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
        {columns.map((col) => {
          const isDate = col === dateCol;
          const isName = col === nameCol;
          const checked = selected.has(col);

          return (
            <button
              key={col}
              onClick={() => onChange(col, !checked)}
              className={cn(
                "flex items-start gap-2 px-3 py-2.5 rounded-lg border text-left transition-all duration-150 text-xs",
                checked
                  ? "border-[var(--color-accent-muted)] bg-[var(--color-accent-soft)] text-[var(--color-text)]"
                  : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-accent-muted)]"
              )}
            >
              <span className="mt-0.5 shrink-0 text-[var(--color-accent)]">
                {checked ? (
                  <CheckSquare size={13} />
                ) : (
                  <Square size={13} className="text-[var(--color-border)]" />
                )}
              </span>
              <span className="leading-tight">
                {col}
                {(isDate || isName) && (
                  <span
                    className={cn(
                      "ml-1 inline-block px-1 py-0.5 rounded text-[10px] font-semibold leading-none",
                      isDate
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    )}
                  >
                    {isDate ? "date" : "name"}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
