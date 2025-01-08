import { convertInchesToTwip, IStylesOptions } from 'docx';

export const documentStyles: IStylesOptions = {
  default: {
    document: {
      run: {
        font: "Times New Roman",
        size: 24,
      },
      paragraph: {
        spacing: { before: 240, after: 240 },
      },
    },
    heading1: {
      run: {
        font: "Times New Roman",
        size: 32,
        bold: true,
      },
      paragraph: {
        spacing: { before: 480, after: 240 },
        alignment: 'center',
      },
    },
    heading2: {
      run: {
        font: "Times New Roman",
        size: 28,
        bold: true,
      },
      paragraph: {
        spacing: { before: 360, after: 240 },
      },
    },
  },
};

export const pageSettings = {
  width: convertInchesToTwip(8.5),
  height: convertInchesToTwip(11),
  margins: {
    top: convertInchesToTwip(1),
    right: convertInchesToTwip(1),
    bottom: convertInchesToTwip(1),
    left: convertInchesToTwip(1.5),
  },
};