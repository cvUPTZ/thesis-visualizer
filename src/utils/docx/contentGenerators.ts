import { Document, Paragraph, TextRun, HeadingLevel, IRunOptions, IParagraphOptions } from 'docx';

export const createHeading = (text: string, level: typeof HeadingLevel) => {
  return new Paragraph({
    text,
    heading: level,
    spacing: {
      before: 240,
      after: 120
    }
  });
};

export const createParagraph = (text: string, options?: IParagraphOptions) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        italics: true // Fixed from 'italic' to 'italics'
      })
    ],
    ...options
  });
};

// Remove sectionProperties from paragraph options as it's not a valid property
export const createSection = (title: string) => {
  return new Paragraph({
    text: title,
    spacing: {
      before: 480,
      after: 240
    }
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
