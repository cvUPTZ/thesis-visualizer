import { 
  IStylesOptions, 
  convertInchesToTwip,
  HeadingLevel,
  AlignmentType
} from 'docx';

export const defaultStyles: IStylesOptions = {
  default: {
    document: {
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        spacing: { line: 360, before: 240, after: 240 },
      },
    },
    heading1: {
      run: {
        font: 'Times New Roman',
        size: 32,
        bold: true,
      },
      paragraph: {
        spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
        alignment: AlignmentType.CENTER,
      },
    },
    heading2: {
      run: {
        font: 'Times New Roman',
        size: 28,
        bold: true,
      },
      paragraph: {
        spacing: { before: convertInchesToTwip(0.75), after: convertInchesToTwip(0.5) },
      },
    },
    heading3: {
      run: {
        font: 'Times New Roman',
        size: 26,
        bold: true,
      },
      paragraph: {
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.25) },
      },
    },
  },
  paragraphStyles: [
    {
      id: 'title',
      name: 'Title',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'Times New Roman',
        size: 36,
        bold: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(1) },
      },
    },
    {
      id: 'subtitle',
      name: 'Subtitle',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'Times New Roman',
        size: 28,
        italic: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.5) },
      },
    },
    {
      id: 'footnote',
      name: 'Footnote',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'Times New Roman',
        size: 20,
      },
      paragraph: {
        indent: { left: convertInchesToTwip(0.5) },
        spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
      },
    },
  ],
};

export const previewStyles: IStylesOptions = {
  default: {
    document: {
      run: {
        font: 'Arial',
        size: 24,
      },
      paragraph: {
        spacing: { line: 360, before: 240, after: 240 },
      },
    },
    heading1: {
      run: {
        font: 'Arial',
        size: 32,
        bold: true,
      },
      paragraph: {
        spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
        alignment: AlignmentType.CENTER,
      },
    },
    heading2: {
      run: {
        font: 'Arial',
        size: 28,
        bold: true,
      },
      paragraph: {
        spacing: { before: convertInchesToTwip(0.75), after: convertInchesToTwip(0.5) },
      },
    },
    heading3: {
      run: {
        font: 'Arial',
        size: 26,
        bold: true,
      },
      paragraph: {
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.25) },
      },
    },
  },
  paragraphStyles: [
    {
      id: 'title',
      name: 'Title',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'Arial',
        size: 36,
        bold: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(1) },
      },
    },
    {
      id: 'subtitle',
      name: 'Subtitle',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'Arial',
        size: 28,
        italic: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.5) },
      },
    },
    {
      id: 'footnote',
      name: 'Footnote',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'Arial',
        size: 20,
      },
      paragraph: {
        indent: { left: convertInchesToTwip(0.5) },
        spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
      },
    },
  ],
};
