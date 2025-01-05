import { HeadingLevel, Paragraph, TextRun, IStylesOptions, convertInchesToTwip } from 'docx';

// Academic formatting constants
const FONT_FAMILY = 'Times New Roman';
const NORMAL_FONT_SIZE = 24; // 12pt
const HEADING1_FONT_SIZE = 32; // 16pt
const HEADING2_FONT_SIZE = 28; // 14pt
const TITLE_FONT_SIZE = 36; // 18pt
const LINE_SPACING = 480; // Double spacing (240 = single space)
const PARAGRAPH_SPACING = 240; // 12pt

export const styles = {
  titlePage: {
    title: {
      heading: HeadingLevel.TITLE,
      alignment: 'center',
      spacing: { before: PARAGRAPH_SPACING * 2, after: PARAGRAPH_SPACING * 2 },
    },
    subtitle: {
      heading: HeadingLevel.HEADING_1,
      alignment: 'center',
      spacing: { before: PARAGRAPH_SPACING * 2, after: PARAGRAPH_SPACING * 2 },
    },
    author: {
      alignment: 'center',
      spacing: { before: PARAGRAPH_SPACING * 2, after: PARAGRAPH_SPACING * 2 },
    },
  },
  content: {
    heading1: {
      heading: HeadingLevel.HEADING_1,
      spacing: { before: PARAGRAPH_SPACING * 2, after: PARAGRAPH_SPACING },
    },
    heading2: {
      heading: HeadingLevel.HEADING_2,
      spacing: { before: PARAGRAPH_SPACING * 2, after: PARAGRAPH_SPACING },
    },
    normal: {
      spacing: { before: 0, after: PARAGRAPH_SPACING },
    },
  },
};

export const defaultStyles: IStylesOptions = {
  default: {
    document: {
      run: {
        size: NORMAL_FONT_SIZE,
        font: FONT_FAMILY,
      },
      paragraph: {
        spacing: { 
          line: LINE_SPACING,
          before: PARAGRAPH_SPACING,
          after: PARAGRAPH_SPACING,
        },
      },
    },
    heading1: {
      run: {
        size: HEADING1_FONT_SIZE,
        bold: true,
        font: FONT_FAMILY,
      },
      paragraph: {
        spacing: { 
          before: PARAGRAPH_SPACING * 2,
          after: PARAGRAPH_SPACING,
          line: LINE_SPACING,
        },
        keepNext: true,
        keepLines: true,
      },
    },
    heading2: {
      run: {
        size: HEADING2_FONT_SIZE,
        bold: true,
        font: FONT_FAMILY,
      },
      paragraph: {
        spacing: { 
          before: PARAGRAPH_SPACING * 1.5,
          after: PARAGRAPH_SPACING,
          line: LINE_SPACING,
        },
        keepNext: true,
        keepLines: true,
      },
    },
    title: {
      run: {
        size: TITLE_FONT_SIZE,
        bold: true,
        font: FONT_FAMILY,
      },
      paragraph: {
        spacing: { 
          before: PARAGRAPH_SPACING * 3,
          after: PARAGRAPH_SPACING * 2,
          line: LINE_SPACING,
        },
        alignment: 'center',
      },
    },
  },
  paragraphStyles: [
    {
      id: 'blockquote',
      name: 'Block Quote',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        size: NORMAL_FONT_SIZE,
        font: FONT_FAMILY,
        italic: true,
      },
      paragraph: {
        spacing: { 
          line: LINE_SPACING,
          before: PARAGRAPH_SPACING,
          after: PARAGRAPH_SPACING,
        },
        indent: {
          left: convertInchesToTwip(0.5),
          right: convertInchesToTwip(0.5),
        },
      },
    },
    {
      id: 'caption',
      name: 'Caption',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        size: NORMAL_FONT_SIZE - 2,
        font: FONT_FAMILY,
        italic: true,
      },
      paragraph: {
        spacing: { 
          line: LINE_SPACING,
          before: PARAGRAPH_SPACING / 2,
          after: PARAGRAPH_SPACING,
        },
        alignment: 'center',
      },
    },
  ],
};

export const createStyledParagraph = (text: string, style: any): Paragraph => {
  return new Paragraph({
    ...style,
    children: [new TextRun(text)],
  });
};