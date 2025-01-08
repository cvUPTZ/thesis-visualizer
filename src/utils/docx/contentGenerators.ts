import { Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { DocxGenerationOptions } from './types';

export const createParagraph = (text: string, options: DocxGenerationOptions): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: options.font,
        size: options.fontSize,
      }),
    ],
  });
};

export const createHeading = (
  text: string, 
  level: HeadingLevel, 
  options: DocxGenerationOptions
): Paragraph => {
  return new Paragraph({
    heading: level,
    children: [
      new TextRun({
        text,
        font: options.font,
        size: level === HeadingLevel.HEADING_1 ? options.fontSize * 1.5 : options.fontSize * 1.25,
        bold: true,
      }),
    ],
  });
};