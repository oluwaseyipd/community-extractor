"use client";

/**
 * Pure-JS PDF export — no jspdf, no html2canvas, no extra deps.
 * Builds a minimal valid PDF binary from scratch using only browser APIs.
 */

function escPdf(str: string): string {
  return (str ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .slice(0, 80);
}

export async function exportToPdf(
  rows: Record<string, string>[],
  columns: string[],
  title = "Community Members"
) {
  const PW = 842;
  const PH = 595;
  const MARGIN = 40;
  const HEADER_H = 28;
  const ROW_H = 18;
  const FONT_SIZE_TITLE = 18;
  const FONT_SIZE_SUB = 9;
  const FONT_SIZE_TABLE = 7.5;

  const colCount = columns.length;
  const colWidth = Math.floor((PW - MARGIN * 2) / colCount);

  const usableHeight = PH - MARGIN * 2 - 60 - HEADER_H;
  const rowsPerPage = Math.max(1, Math.floor(usableHeight / ROW_H));

  const objects: string[] = [];
  let objIdx = 1;

  function addObj(content: string): number {
    const id = objIdx++;
    objects.push(`${id} 0 obj\n${content}\nendobj`);
    return id;
  }

  const pageContentIds: number[] = [];
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  for (let p = 0; p < totalPages; p++) {
    const pageRows = rows.slice(p * rowsPerPage, (p + 1) * rowsPerPage);
    const lines: string[] = [];

    if (p === 0) {
      lines.push(`BT /F1 ${FONT_SIZE_TITLE} Tf ${MARGIN} ${PH - MARGIN - FONT_SIZE_TITLE} Td (${escPdf(title)}) Tj ET`);
      const sub = `Exported ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}  |  ${rows.length} records  |  ${columns.length} columns`;
      lines.push(`BT /F2 ${FONT_SIZE_SUB} Tf 0.42 0.44 0.51 rg ${MARGIN} ${PH - MARGIN - FONT_SIZE_TITLE - 14} Td (${escPdf(sub)}) Tj ET`);
    }

    const tableTop = p === 0 ? PH - MARGIN - 60 : PH - MARGIN - 10;

    // Header bg
    lines.push(`0.059 0.067 0.09 rg ${MARGIN} ${tableTop - HEADER_H} ${PW - MARGIN * 2} ${HEADER_H} re f`);

    // Header text
    columns.forEach((col, i) => {
      const x = MARGIN + i * colWidth + 4;
      const y = tableTop - HEADER_H + 7;
      lines.push(`BT /F1 ${FONT_SIZE_TABLE} Tf 1 1 1 rg ${x} ${y} Td (${escPdf(col.toUpperCase())}) Tj ET`);
    });

    // Data rows
    pageRows.forEach((row, ri) => {
      const y = tableTop - HEADER_H - (ri + 1) * ROW_H;
      if (ri % 2 === 1) {
        lines.push(`0.957 0.961 0.98 rg ${MARGIN} ${y} ${PW - MARGIN * 2} ${ROW_H} re f`);
      } else {
        lines.push(`1 1 1 rg ${MARGIN} ${y} ${PW - MARGIN * 2} ${ROW_H} re f`);
      }
      lines.push(`0.886 0.898 0.933 RG 0.3 w ${MARGIN} ${y} ${PW - MARGIN * 2} ${ROW_H} re S`);

      columns.forEach((col, ci) => {
        const x = MARGIN + ci * colWidth + 4;
        lines.push(`BT /F2 ${FONT_SIZE_TABLE} Tf 0.102 0.122 0.212 rg ${x} ${y + 5} Td (${escPdf(row[col] ?? "")}) Tj ET`);
      });
    });

    // Page number
    lines.push(`BT /F2 8 Tf 0.42 0.44 0.51 rg ${PW / 2 - 20} ${MARGIN - 15} Td (Page ${p + 1} of ${totalPages}) Tj ET`);

    const streamContent = lines.join("\n");
    const contentId = addObj(`<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`);
    pageContentIds.push(contentId);
  }

  const font1Id = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const font2Id = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const resId = addObj(`<< /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R >> >>`);

  // Placeholder pages id — will fix after
  const pagesPlaceholderId = objIdx;
  const pageIds: number[] = [];
  for (let p = 0; p < totalPages; p++) {
    const pid = addObj(`<< /Type /Page /Parent ${pagesPlaceholderId} 0 R /MediaBox [0 0 ${PW} ${PH}] /Contents ${pageContentIds[p]} 0 R /Resources ${resId} 0 R >>`);
    pageIds.push(pid);
  }

  const kidsRef = pageIds.map((id) => `${id} 0 R`).join(" ");
  const pagesId = addObj(`<< /Type /Pages /Kids [${kidsRef}] /Count ${totalPages} >>`);

  const catalogId = addObj(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  // Assemble
  let pdf = "%PDF-1.4\n";
  const xrefOffsets: Record<number, number> = {};

  objects.forEach((obj) => {
    const m = obj.match(/^(\d+) 0 obj/);
    if (m) xrefOffsets[parseInt(m[1])] = pdf.length;
    pdf += obj + "\n\n";
  });

  const xrefPos = pdf.length;
  const maxId = Math.max(...Object.keys(xrefOffsets).map(Number));

  pdf += "xref\n";
  pdf += `0 ${maxId + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= maxId; i++) {
    const off = xrefOffsets[i];
    pdf += (off !== undefined ? String(off).padStart(10, "0") : "0000000000") + " 00000 n \n";
  }

  pdf += `trailer\n<< /Size ${maxId + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}