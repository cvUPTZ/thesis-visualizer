import { Paragraph, TextRun, AlignmentType } from 'docx';
import { TitlePageOptions } from './types';

export const generateTitlePage = (options: TitlePageOptions): Paragraph[] => {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 240 },
      children: [
        new TextRun({
          text: options.title,
          bold: true,
          size: 32,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 240 },
      children: [
        new TextRun({
          text: options.author,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 1440 },
      children: [
        new TextRun({
          text: options.date,
          size: 24,
        }),
      ],
    }),
  ];
};