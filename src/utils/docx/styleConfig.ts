import { HeadingLevel, Paragraph, TextRun, IStylesOptions } from 'docx';

export const styles = {
  titlePage: {
    title: {
      heading: HeadingLevel.TITLE,
      alignment: 'center',
      spacing: { before: 240, after: 240 },
    },
    subtitle: {
      heading: HeadingLevel.HEADING_1,
      alignment: 'center',
      spacing: { before: 240, after: 240 },
    },
    author: {
      alignment: 'center',
      spacing: { before: 240, after: 240 },
    },
  },
  content: {
    heading1: {
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
    },
    heading2: {
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
    },
    normal: {
      spacing: { before: 120, after: 120 },
    },
  },
};

export const defaultStyles: IStylesOptions = {
  default: {
    heading1: {
      run: {
        size: 28,
        bold: true,
        color: '000000',
      },
      paragraph: {
        spacing: { before: 240, after: 120 },
      },
    },
    heading2: {
      run: {
        size: 24,
        bold: true,
        color: '000000',
      },
      paragraph: {
        spacing: { before: 240, after: 120 },
      },
    },
    document: {
      run: {
        size: 24,
        font: 'Calibri',
      },
      paragraph: {
        spacing: { line: 276 },
      },
    },
  },
};

export const createStyledParagraph = (text: string, style: any): Paragraph => {
  return new Paragraph({
    ...style,
    children: [new TextRun(text)],
  });
};