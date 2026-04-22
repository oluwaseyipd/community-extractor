import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Similarity score between two strings (0–1) */
export function stringSimilarity(a: string, b: string): number {
  const la = a.toLowerCase().replace(/[\s_-]/g, "");
  const lb = b.toLowerCase().replace(/[\s_-]/g, "");
  if (la === lb) return 1;
  if (la.includes(lb) || lb.includes(la)) return 0.8;
  let matches = 0;
  for (const ch of la) {
    if (lb.includes(ch)) matches++;
  }
  return matches / Math.max(la.length, lb.length);
}

const DATE_HINTS = ["date", "dob", "birth", "joined", "timestamp", "when", "created"];
const NAME_HINTS = ["name", "fullname", "surname", "first", "member", "user"];

/** Auto-detect the most likely Date and Name columns from headers */
export function detectColumns(headers: string[]): {
  dateCol: string | null;
  nameCol: string | null;
} {
  let dateCol: string | null = null;
  let nameCol: string | null = null;
  let bestDateScore = 0;
  let bestNameScore = 0;

  for (const h of headers) {
    const hl = h.toLowerCase();
    for (const hint of DATE_HINTS) {
      const score = stringSimilarity(hl, hint);
      if (score > bestDateScore) {
        bestDateScore = score;
        dateCol = h;
      }
    }
    for (const hint of NAME_HINTS) {
      const score = stringSimilarity(hl, hint);
      if (score > bestNameScore) {
        bestNameScore = score;
        nameCol = h;
      }
    }
  }

  return { dateCol, nameCol };
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function getMonthOptions(): { label: string; value: string }[] {
  const opts = [{ label: "All Records", value: "all" }];
  for (let i = 0; i < 12; i++) {
    opts.push({ label: MONTH_NAMES[i], value: String(i) });
  }
  return opts;
}

/**
 * Robustly parse a date string in many formats. Returns Date or null.
 * Handles:
 *   - YYYY/MM/DD ...  (e.g. "2022/01/05 8:53:07 PM GMT+1")
 *   - YYYY-MM-DD
 *   - DD/MM/YYYY
 *   - DD/MM/YY
 *   - MM/DD/YYYY (US)
 *   - "05/01/2022" ambiguous — we try DD/MM first
 */
export function parseDate(value: string): Date | null {
  if (!value || typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;

  // YYYY/MM/DD or YYYY-MM-DD (with optional time after)
  const ymdMatch = v.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymdMatch) {
    const d = new Date(
      parseInt(ymdMatch[1]),
      parseInt(ymdMatch[2]) - 1,
      parseInt(ymdMatch[3])
    );
    if (!isNaN(d.getTime())) return d;
  }

  // DD/MM/YYYY or DD/MM/YY
  const dmyMatch = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (dmyMatch) {
    let year = parseInt(dmyMatch[3]);
    if (year < 100) year += 2000;
    const d = new Date(year, parseInt(dmyMatch[2]) - 1, parseInt(dmyMatch[1]));
    if (!isNaN(d.getTime())) return d;
  }

  // Month name formats: "10/11/2019", "Jan 5, 2022", etc — try native parser last
  const native = new Date(v);
  if (!isNaN(native.getTime())) return native;

  return null;
}

/** Filter rows by month (0-indexed) on a given column */
export function filterByMonth(
  rows: Record<string, string>[],
  dateCol: string,
  month: number
): Record<string, string>[] {
  return rows.filter((row) => {
    const raw = row[dateCol];
    if (!raw) return false;
    const d = parseDate(raw);
    return d !== null && d.getMonth() === month;
  });
}