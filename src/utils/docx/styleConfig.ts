import { HeadingLevel, IStylesOptions, convertInchesToTwip } from 'docx';

// Academic formatting constants
const FONT_FAMILY = 'Times New Roman';
const NORMAL_FONT_SIZE = 24; // 12pt
const HEADING1_FONT_SIZE = 32; // 16pt
const HEADING2_FONT_SIZE = 28; // 14pt
const TITLE_FONT_SIZE = 36; // 18pt
const LINE_SPACING = 480; // Double spacing (240 = single space)
const PARAGRAPH_SPACING = 240; // 12pt

// Preview formatting constants
const PREVIEW_FONT_FAMILY = 'Arial';
const PREVIEW_NORMAL_FONT_SIZE = 24;
const PREVIEW_HEADING1_FONT_SIZE = 32;
const PREVIEW_HEADING2_FONT_SIZE = 28;
const PREVIEW_LINE_SPACING = 360;
const PREVIEW_PARAGRAPH_SPACING = 240;

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

export const previewStyles: IStylesOptions = {
  default: {
    document: {
      run: {
        size: PREVIEW_NORMAL_FONT_SIZE,
        font: PREVIEW_FONT_FAMILY,
      },
      paragraph: {
        spacing: { 
          line: PREVIEW_LINE_SPACING,
          before: PREVIEW_PARAGRAPH_SPACING,
          after: PREVIEW_PARAGRAPH_SPACING,
        },
      },
    },
    heading1: {
      run: {
        size: PREVIEW_HEADING1_FONT_SIZE,
        bold: true,
        font: PREVIEW_FONT_FAMILY,
      },
      paragraph: {
        spacing: { 
          before: PREVIEW_PARAGRAPH_SPACING * 2,
          after: PREVIEW_PARAGRAPH_SPACING,
          line: PREVIEW_LINE_SPACING,
        },
      },
    },
    heading2: {
      run: {
        size: PREVIEW_HEADING2_FONT_SIZE,
        bold: true,
        font: PREVIEW_FONT_FAMILY,
      },
      paragraph: {
        spacing: { 
          before: PREVIEW_PARAGRAPH_SPACING * 1.5,
          after: PREVIEW_PARAGRAPH_SPACING,
          line: PREVIEW_LINE_SPACING,
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
        size: PREVIEW_NORMAL_FONT_SIZE,
        font: PREVIEW_FONT_FAMILY,
        italics: true,
      },
      paragraph: {
        spacing: { 
          line: PREVIEW_LINE_SPACING,
          before: PREVIEW_PARAGRAPH_SPACING,
          after: PREVIEW_PARAGRAPH_SPACING,
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
        size: PREVIEW_NORMAL_FONT_SIZE - 2,
        font: PREVIEW_FONT_FAMILY,
        italics: true,
      },
      paragraph: {
        spacing: { 
          line: PREVIEW_LINE_SPACING,
          before: PREVIEW_PARAGRAPH_SPACING / 2,
          after: PREVIEW_PARAGRAPH_SPACING,
        },
        alignment: 'center',
      },
    },
  ],
};