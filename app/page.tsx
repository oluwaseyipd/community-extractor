"use client";
import { useState, useCallback, useMemo } from "react";
import Papa from "papaparse";
import { DropZone } from "@/components/DropZone";
import { ColumnToggler } from "@/components/ColumnToggler";
import { MonthFilter } from "@/components/MonthFilter";
import { DataPreview } from "@/components/DataPreview";
import { ExportBar } from "@/components/ExportBar";
import { detectColumns, filterByMonth } from "@/lib/utils";
import { Database, RefreshCw, ChevronRight } from "lucide-react";

type Step = "upload" | "configure" | "preview";

interface AppState {
  step: Step;
  fileName: string;
  allRows: Record<string, string>[];
  columns: string[];
  selectedCols: string[]; // plain array — no Set issues with React state
  autoDateCol: string | null;
  autoNameCol: string | null;
  selectedDateCol: string;
  selectedMonth: string;
}

const INITIAL: AppState = {
  step: "upload",
  fileName: "",
  allRows: [],
  columns: [],
  selectedCols: [],
  autoDateCol: null,
  autoNameCol: null,
  selectedDateCol: "",
  selectedMonth: "all",
};

export default function Home() {
  const [state, setState] = useState<AppState>(INITIAL);

  const patch = (partial: Partial<AppState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const handleFile = useCallback((file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const headers = result.meta.fields ?? [];
        const { dateCol, nameCol } = detectColumns(headers);
        // Set everything in one atomic update — no stale state
        setState({
          step: "configure",
          fileName: file.name,
          allRows: result.data,
          columns: headers,
          selectedCols: [...headers], // all selected by default
          autoDateCol: dateCol,
          autoNameCol: nameCol,
          selectedDateCol: dateCol ?? "",
          selectedMonth: "all",
        });
      },
    });
  }, []);

  const selectedColsSet = useMemo(() => new Set(state.selectedCols), [state.selectedCols]);

  const filteredRows = useMemo(() => {
    if (!state.selectedDateCol || !state.selectedMonth || state.selectedMonth === "all") {
      return state.allRows;
    }
    const monthNum = parseInt(state.selectedMonth);
    if (isNaN(monthNum)) return state.allRows;
    const filtered = filterByMonth(state.allRows, state.selectedDateCol, monthNum);
    return filtered.length > 0 ? filtered : state.allRows;
  }, [state.allRows, state.selectedDateCol, state.selectedMonth]);

  // Preserve original column order, only include selected ones
  const exportCols = useMemo(
    () => state.columns.filter((c) => selectedColsSet.has(c)),
    [state.columns, selectedColsSet]
  );

  function reset() {
    setState(INITIAL);
  }

  const STEPS: { key: Step; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "configure", label: "Configure" },
    { key: "preview", label: "Preview & Export" },
  ];

  const stepIndex = STEPS.findIndex((s) => s.key === state.step);

  return (
    <div className="min-h-screen bg-[var(--color-surface-dim)]">
      {/* Header */}
      <header className="bg-[var(--color-ink)] text-white px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
              <Database size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                Community Extractor
              </h1>
              <p className="text-xs text-white/50 mt-0.5">CSV → Word / PDF</p>
            </div>
          </div>
          {state.step !== "upload" && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={13} />
              New file
            </button>
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text-muted)]"
              }`}>
                {i + 1}. {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <ChevronRight size={13} className="text-[var(--color-border)]" />
              )}
            </div>
          ))}
          {state.step !== "upload" && (
            <span className="ml-auto text-xs text-[var(--color-text-muted)] font-mono truncate max-w-[200px]">
              {state.fileName}
            </span>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Step 1: Upload */}
        {state.step === "upload" && (
          <div className="fade-up space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>
                Upload your CSV
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">
                Drop a community data CSV file to get started. All processing happens in your browser — your data never leaves your device.
              </p>
            </div>
            <DropZone onFile={handleFile} />
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "🔒", label: "100% Private", desc: "Parsed in-browser only" },
                { icon: "⚡", label: "Instant Parsing", desc: "Powered by PapaParse" },
                { icon: "📤", label: "Two Export Formats", desc: "Word (.docx) & PDF" },
              ].map((f) => (
                <div key={f.label} className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{f.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Configure */}
        {state.step === "configure" && (
          <div className="fade-up space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>
                  Configure Columns
                </h2>
                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                  {state.allRows.length} rows detected. Select which columns to include and optionally filter by month.
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-dim)] px-2 py-1 rounded-lg shrink-0">
                {state.allRows.length} rows · {state.columns.length} cols
              </span>
            </div>

            {(state.autoDateCol || state.autoNameCol) && (
              <div className="bg-[var(--color-accent-soft)] border border-[var(--color-accent-muted)] rounded-xl px-4 py-3 text-sm text-[var(--color-accent)]">
                <span className="font-semibold">Auto-detected:</span>{" "}
                {[
                  state.autoNameCol && `name → "${state.autoNameCol}"`,
                  state.autoDateCol && `date → "${state.autoDateCol}"`,
                ].filter(Boolean).join(" · ")}
              </div>
            )}

            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-5">
              <ColumnToggler
                columns={state.columns}
                selected={selectedColsSet}
                dateCol={state.autoDateCol}
                nameCol={state.autoNameCol}
                onChange={(col, checked) => {
                  patch({
                    selectedCols: checked
                      ? [...state.selectedCols, col]
                      : state.selectedCols.filter((c) => c !== col),
                  });
                }}
                onSelectAll={() => patch({ selectedCols: [...state.columns] })}
                onDeselectAll={() => patch({ selectedCols: [] })}
              />

              <hr className="border-[var(--color-border)]" />

              <MonthFilter
                dateCol={state.autoDateCol}
                columns={state.columns}
                selectedDateCol={state.selectedDateCol}
                selectedMonth={state.selectedMonth}
                onDateColChange={(col) => patch({ selectedDateCol: col, selectedMonth: "all" })}
                onMonthChange={(m) => patch({ selectedMonth: m })}
              />

              <div className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-dim)] rounded-lg px-3 py-2">
                {state.selectedMonth === "all" || !state.selectedDateCol
                  ? `All ${state.allRows.length} records will be exported · ${exportCols.length} columns selected`
                  : `${filteredRows.length} of ${state.allRows.length} records match · ${exportCols.length} columns selected`}
              </div>
            </div>

            <button
              onClick={() => patch({ step: "preview" })}
              disabled={exportCols.length === 0}
              className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Preview & Export →
            </button>
          </div>
        )}

        {/* Step 3: Preview & Export */}
        {state.step === "preview" && (
          <div className="fade-up space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>
                  Preview & Export
                </h2>
                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                  {filteredRows.length} records · {exportCols.length} columns
                </p>
              </div>
              <button
                onClick={() => patch({ step: "configure" })}
                className="text-xs font-medium text-[var(--color-accent)] hover:underline"
              >
                ← Back to configure
              </button>
            </div>

            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 space-y-5">
              <DataPreview rows={filteredRows.slice(0, 50)} columns={exportCols} />
              {filteredRows.length > 50 && (
                <p className="text-xs text-center text-[var(--color-text-muted)]">
                  Previewing first 50 rows. All {filteredRows.length} records will be exported.
                </p>
              )}
              <ExportBar
                rows={filteredRows}
                columns={exportCols}
                disabled={filteredRows.length === 0 || exportCols.length === 0}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-[var(--color-text-muted)]">
        Community Data Extractor · All processing is client-side · No data is stored
      </footer>
    </div>
  );
}