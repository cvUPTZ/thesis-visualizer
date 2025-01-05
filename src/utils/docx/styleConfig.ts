import { HeadingLevel, IStylesOptions, convertInchesToTwip } from 'docx';

// Academic formatting constants
const FONT_FAMILY = 'Times New Roman';
const NORMAL_FONT_SIZE = 24; // 12pt
const HEADING1_FONT_SIZE = 32; // 16pt
const HEADING2_FONT_SIZE = 28; // 14pt
const TITLE_FONT_SIZE = 36; // 18pt
const LINE_SPACING = 480; // Double spacing (240 = single space)
const PARAGRAPH_SPACING = 240; // 12pt

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
        italics: true,
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
        italics: true,
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

// Preview styles matching the web preview
export const previewStyles: IStylesOptions = {
  default: {
    document: {
      run: {
        size: 24,
        font: 'Arial',
      },
      paragraph: {
        spacing: { 
          line: 360,
          before: 240,
          after: 240,
        },
      },
    },
    heading1: {
      run: {
        size: 32,
        bold: true,
        font: 'Arial',
      },
      paragraph: {
        spacing: { 
          before: 480,
          after: 240,
          line: 360,
        },
      },
    },
    heading2: {
      run: {
        size: 28,
        bold: true,
        font: 'Arial',
      },
      paragraph: {
        spacing: { 
          before: 360,
          after: 240,
          line: 360,
        },
      },
    },
  },
  paragraphStyles: [
    {
      id: 'preview-blockquote',
      name: 'Preview Block Quote',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        size: 24,
        font: 'Arial',
        italics: true,
      },
      paragraph: {
        spacing: { 
          line: 360,
          before: 240,
          after: 240,
        },
        indent: {
          left: convertInchesToTwip(0.5),
          right: convertInchesToTwip(0.5),
        },
      },
    },
    {
      id: 'preview-caption',
      name: 'Preview Caption',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        size: 22,
        font: 'Arial',
        italics: true,
      },
      paragraph: {
        spacing: { 
          line: 360,
          before: 120,
          after: 240,
        },
        alignment: 'center',
      },
    },
  ],
};