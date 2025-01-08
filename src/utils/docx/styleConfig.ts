import { StyleConfig } from './types';

export const defaultStyles: StyleConfig = {
  default: {
    document: {
      run: {
        font: "Times New Roman",
        size: 24,
      },
      paragraph: {
        spacing: {
          before: 120,
          after: 120,
        },
      },
    },
    heading1: {
      run: {
        size: 36,
        bold: true,
        color: "000000",
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 120,
        },
      },
    },
    heading2: {
      run: {
        size: 28,
        bold: true,
        color: "000000",
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 120,
        },
      },
    },
  },
};

export const previewStyles: StyleConfig = {
  default: {
    document: {
      run: {
        font: "Arial",
        size: 24,
      },
      paragraph: {
        spacing: {
          before: 120,
          after: 120,
        },
      },
    },
    heading1: {
      run: {
        size: 32,
        bold: true,
        color: "000000",
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 120,
        },
      },
    },
    heading2: {
      run: {
        size: 28,
        bold: true,
        color: "000000",
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 120,
        },
      },
    },
  },
};