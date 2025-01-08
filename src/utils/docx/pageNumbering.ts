import { Paragraph, TextRun, AlignmentType } from 'docx';

export const createPageNumberParagraph = (): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun("Page "),
      new TextRun({
        children: ["PAGE"],
      }),
      new TextRun(" of "),
      new TextRun({
        children: ["NUMPAGES"],
      }),
    ],
    alignment: AlignmentType.CENTER,
  });
};