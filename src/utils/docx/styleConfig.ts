import { HeadingLevel, Paragraph, TextRun } from 'docx';

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

export const createStyledParagraph = (text: string, style: any): Paragraph => {
  return new Paragraph({
    ...style,
    children: [new TextRun(text)],
  });
};