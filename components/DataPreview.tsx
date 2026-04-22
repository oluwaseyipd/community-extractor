"use client";
import { cn } from "@/lib/utils";

interface DataPreviewProps {
  rows: Record<string, string>[];
  columns: string[];
}

export function DataPreview({ rows, columns }: DataPreviewProps) {
  if (columns.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">
        No columns selected. Toggle some columns above to preview.
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">
        No records match the current filter.
      </div>
    );
  }

  return (
    <div className="fade-up overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 48 }}>#</th>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="text-[var(--color-text-muted)] font-mono text-xs">
                {i + 1}
              </td>
              {columns.map((col) => (
                <td key={col} title={row[col] ?? ""}>
                  {row[col] ?? (
                    <span className="text-[var(--color-border)] italic text-xs">
                      —
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
