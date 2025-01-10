import { Document, Paragraph, TextRun, PageBreak, AlignmentType, convertInchesToTwip } from 'docx';
import { TitlePageOptions } from './types';
import { createParagraph, createHeading } from './contentGenerators';

export const generateTitlePage = (options: TitlePageOptions): Paragraph[] => [
  new Paragraph({
    children: [
      new TextRun({
        text: options.university || '',
        font: 'Times New Roman',
        size: 28,
      }),
    ],
    spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(0.5) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: options.title,
        font: 'Times New Roman',
        size: 32,
        bold: true,
      }),
    ],
    spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: `By\n${options.author}`,
        font: 'Times New Roman',
        size: 28,
      }),
    ],
    spacing: { before: convertInchesToTwip(1) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: `A thesis submitted in partial fulfillment\nof the requirements for the degree of\n${options.degree || ''}`,
        font: 'Times New Roman',
        size: 24,
      }),
    ],
    spacing: { before: convertInchesToTwip(4) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: options.date,
        font: 'Times New Roman',
        size: 24,
      }),
    ],
    spacing: { before: convertInchesToTwip(4) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

export const generateAbstractSection = (content: string): Paragraph[] => [
  new Paragraph({
    children: [
      new TextRun({
        text: 'ABSTRACT',
        font: 'Times New Roman',
        size: 32,
        bold: true,
      }),
    ],
    spacing: { before: 720, after: 480 },
    alignment: AlignmentType.CENTER,
  }),
  ...content.split('\n').map(paragraph => 
    new Paragraph({
      children: [
        new TextRun({
          text: paragraph,
          font: 'Times New Roman',
          size: 24,
        }),
      ],
      spacing: { line: 360 }, // 1.5 spacing
      indent: { firstLine: convertInchesToTwip(0.5) },
    })
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

export const generateChapterContent = (
  chapterNumber: number,
  title: string,
  content: string
): Paragraph[] => [
  new Paragraph({
    children: [
      new TextRun({
        text: `CHAPTER ${chapterNumber}`,
        font: 'Times New Roman',
        size: 32,
        bold: true,
      }),
    ],
    spacing: { before: 720, after: 240 },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 32,
        bold: true,
      }),
    ],
    spacing: { before: 240, after: 480 },
    alignment: AlignmentType.CENTER,
  }),
  ...content.split('\n').map(paragraph =>
    new Paragraph({
      children: [
        new TextRun({
          text: paragraph,
          font: 'Times New Roman',
          size: 24,
        }),
      ],
      spacing: { line: 360 }, // 1.5 spacing
      indent: { firstLine: convertInchesToTwip(0.5) },
    })
  ),
];