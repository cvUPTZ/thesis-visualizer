import { StyleConfig } from './types';

export const defaultStyles: StyleConfig = {
  paragraphStyles: [
    {
      id: "Normal",
      name: "Normal",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        size: 24,
        font: "Times New Roman",
      },
      paragraph: {
        spacing: {
          line: 360,
          before: 240,
          after: 240,
        },
      },
    },
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        size: 32,
        bold: true,
        font: "Times New Roman",
      },
      paragraph: {
        spacing: {
          before: 480,
          after: 240,
        },
      },
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        size: 28,
        bold: true,
        font: "Times New Roman",
      },
      paragraph: {
        spacing: {
          before: 360,
          after: 240,
        },
      },
    },
  ],
};