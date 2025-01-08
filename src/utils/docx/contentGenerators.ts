import { HeadingLevel, Paragraph, TextRun } from 'docx';

export const createHeading = (text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel]) => {
  return new Paragraph({
    text,
    heading: level,
  });
};

export const createParagraph = (text: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
      }),
    ],
  });
};

export const createBoldText = (text: string) => {
  return new TextRun({
    text,
    bold: true,
  });
};

export const createItalicText = (text: string) => {
  return new TextRun({
    text,
    italic: true,
  });
};

export const createUnderlinedText = (text: string) => {
  return new TextRun({
    text,
    underline: {},
  });
};

export const createFormattedParagraph = (textRuns: TextRun[]) => {
  return new Paragraph({
    children: textRuns,
  });
};

export const createListItem = (text: string, level: number = 0) => {
  return new Paragraph({
    text,
    bullet: {
      level,
    },
  });
};

export const createNumberedItem = (text: string, level: number = 0) => {
  return new Paragraph({
    text,
    numbering: {
      reference: 'default-numbering',
      level,
    },
  });
};

export const createPageBreak = () => {
  return new Paragraph({
    pageBreakBefore: true,
  });
};

export const createSectionBreak = () => {
  return new Paragraph({
    sectionProperties: {},
  });
};

export const createHorizontalLine = () => {
  return new Paragraph({
    border: {
      bottom: {
        color: 'auto',
        space: 1,
        style: 'single',
        size: 6,
      },
    },
  });
};

export const createSpacing = (spacing: number) => {
  return new Paragraph({
    spacing: {
      before: spacing,
      after: spacing,
    },
  });
};