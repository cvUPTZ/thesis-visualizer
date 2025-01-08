import { StylesOptions, convertInchesToTwip } from 'docx';

export const documentStyles: StylesOptions = {
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
    title: {
      run: {
        font: "Times New Roman",
        size: 36,
        bold: true,
      },
      paragraph: {
        spacing: { before: 720, after: 480 },
        alignment: 'center',
      },
    },
    subtitle: {
      run: {
        font: "Times New Roman",
        size: 28,
        italics: true,
      },
      paragraph: {
        spacing: { before: 240, after: 480 },
        alignment: 'center',
      },
    },
    caption: {
      run: {
        font: "Times New Roman",
        size: 20,
        italics: true,
      },
      paragraph: {
        spacing: { before: 120, after: 240 },
        alignment: 'center',
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