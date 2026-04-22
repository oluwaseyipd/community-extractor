"use client";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  ShadingType,
  BorderStyle,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";

export async function exportToDocx(
  rows: Record<string, string>[],
  columns: string[],
  title = "Community Members"
) {
  const DARK = "0F1117";
  const WHITE = "FFFFFF";
  const LIGHT = "F5F6FA";

  const colWidth = Math.floor(9000 / columns.length);

  const headerCells = columns.map(
    (col) =>
      new TableCell({
        shading: { type: ShadingType.SOLID, color: DARK, fill: DARK },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        width: { size: colWidth, type: WidthType.DXA },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: col.toUpperCase(),
                color: WHITE,
                bold: true,
                size: 18,
                font: "DM Sans",
              }),
            ],
          }),
        ],
      })
  );

  const dataRows = rows.map((row, idx) =>
    new TableRow({
      children: columns.map(
        (col) =>
          new TableCell({
            shading:
              idx % 2 === 1
                ? { type: ShadingType.SOLID, color: LIGHT, fill: LIGHT }
                : undefined,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E5EE" },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            width: { size: colWidth, type: WidthType.DXA },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: row[col] ?? "",
                    size: 18,
                    font: "DM Sans",
                    color: "1A1F36",
                  }),
                ],
              }),
            ],
          })
      ),
    })
  );

  const table = new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: [new TableRow({ children: headerCells }), ...dataRows],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: title,
                font: "DM Serif Display",
                size: 52,
                color: DARK,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Exported on ${new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })} · ${rows.length} records · ${columns.length} columns`,
                size: 20,
                color: "6B7280",
                font: "DM Sans",
              }),
            ],
          }),
          new Paragraph({ children: [] }),
          table,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, "_")}.docx`);
}
