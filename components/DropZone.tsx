"use client";
import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFile: (file: File) => void;
}

export function DropZone({ onFile }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
        onFile(file);
      }
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
        "p-12 text-center",
        dragging
          ? "drop-active border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
          : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent-muted)] hover:bg-[var(--color-accent-soft)]"
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <div
        className={cn(
          "flex items-center justify-center w-16 h-16 rounded-2xl transition-colors",
          dragging
            ? "bg-[var(--color-accent)] text-white"
            : "bg-[var(--color-surface-dim)] text-[var(--color-accent)]"
        )}
      >
        {dragging ? <FileText size={28} /> : <UploadCloud size={28} />}
      </div>

      <div>
        <p className="font-semibold text-[var(--color-text)] text-base mb-1">
          {dragging ? "Release to upload" : "Drop your CSV file here"}
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          or{" "}
          <span className="text-[var(--color-accent)] font-medium underline underline-offset-2">
            click to browse
          </span>
          &nbsp;· .csv files only
        </p>
      </div>
    </div>
  );
}
