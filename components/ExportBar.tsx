"use client";
import { useState } from "react";
import { FileText, FileDown, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportBarProps {
  rows: Record<string, string>[];
  columns: string[];
  disabled: boolean;
}

export function ExportBar({ rows, columns, disabled }: ExportBarProps) {
  const [loading, setLoading] = useState<"docx" | "pdf" | null>(null);
  const [done, setDone] = useState<"docx" | "pdf" | null>(null);

  const title = "Community Members";

  async function handleDocx() {
    setLoading("docx");
    setDone(null);
    try {
      const { exportToDocx } = await import("@/lib/exportDocx");
      await exportToDocx(rows, columns, title);
      setDone("docx");
      setTimeout(() => setDone(null), 2500);
    } finally {
      setLoading(null);
    }
  }

  async function handlePdf() {
    setLoading("pdf");
    setDone(null);
    try {
      const { exportToPdf } = await import("@/lib/exportPdf");
      await exportToPdf(rows, columns, title);
      setDone("pdf");
      setTimeout(() => setDone(null), 2500);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
      <div>
        <p className="text-sm font-semibold text-[var(--color-text)]">
          {rows.length} records ready to export
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {columns.length} columns selected
        </p>
      </div>

      <div className="flex gap-3">
        {/* Word Export */}
        <button
          onClick={handleDocx}
          disabled={disabled || !!loading}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200",
            disabled || loading
              ? "bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed"
              : done === "docx"
              ? "bg-[var(--color-success)] text-white"
              : "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-soft)] active:scale-95"
          )}
        >
          {loading === "docx" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : done === "docx" ? (
            <CheckCircle2 size={15} />
          ) : (
            <FileText size={15} />
          )}
          {done === "docx" ? "Downloaded!" : "Download Word"}
        </button>

        {/* PDF Export */}
        <button
          onClick={handlePdf}
          disabled={disabled || !!loading}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2",
            disabled || loading
              ? "border-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed"
              : done === "pdf"
              ? "border-[var(--color-success)] text-[var(--color-success)] bg-emerald-50"
              : "border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] active:scale-95"
          )}
        >
          {loading === "pdf" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : done === "pdf" ? (
            <CheckCircle2 size={15} />
          ) : (
            <FileDown size={15} />
          )}
          {done === "pdf" ? "Downloaded!" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}
