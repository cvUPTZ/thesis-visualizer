import { 
  IStylesOptions, 
  AlignmentType,
  convertInchesToTwip,
} from 'docx';

export const documentStyles: IStylesOptions = {
  default: {
    heading1: {
      run: {
        size: 28,
        bold: true,
        font: 'Times New Roman',
      },
      paragraph: {
        spacing: {
          after: 120,
        },
        alignment: AlignmentType.CENTER,
      },
    },
    heading2: {
      run: {
        size: 26,
        bold: true,
        font: 'Times New Roman',
      },
      paragraph: {
        spacing: {
          after: 120,
        },
      },
    },
    document: {
      run: {
        size: 24,
        font: 'Times New Roman',
      },
      paragraph: {
        spacing: {
          line: 360,
          after: 200,
        },
      },
    },
  },
};

export const pageSettings = {
  page: {
    margin: {
      top: convertInchesToTwip(1),
      right: convertInchesToTwip(1),
      bottom: convertInchesToTwip(1),
      left: convertInchesToTwip(1),
    },
  },
};