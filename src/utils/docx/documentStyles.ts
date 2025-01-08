import { IStylesOptions, convertInchesToTwip } from 'docx';

const defaultFont = "Times New Roman";
const defaultFontSize = 24; // 12pt

export const documentStyles: IStylesOptions = {
  paragraphStyles: [
    {
      id: "Normal",
      name: "Normal",
      run: {
        font: defaultFont,
        size: defaultFontSize,
      },
      paragraph: {
        spacing: { before: 240, after: 240 }
      }
    },
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      next: "Normal",
      run: {
        font: defaultFont,
        size: 32,
        bold: true
      },
      paragraph: {
        spacing: { before: 480, after: 240 },
        outlineLevel: 0
      }
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      run: {
        font: defaultFont,
        size: 28,
        bold: true
      },
      paragraph: {
        spacing: { before: 360, after: 240 },
        outlineLevel: 1
      }
    }
  ]
};

export const pageSettings = {
  margin: {
    top: convertInchesToTwip(1),
    right: convertInchesToTwip(1),
    bottom: convertInchesToTwip(1),
    left: convertInchesToTwip(1.5) // Extra margin for binding
  }
};