import { IStylesOptions, convertInchesToTwip, BorderStyle } from "docx";

export const documentStyles: IStylesOptions = {
  paragraphStyles: [
    {
      id: "Normal",
      name: "Normal",
      run: {
        font: "Times New Roman",
        size: 24
      }
    },
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      next: "Normal",
      run: {
        bold: true,
        size: 32
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 120
        }
      }
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      run: {
        bold: true,
        size: 28
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 120
        }
      }
    }
  ]
};

export const pageSettings = {
  margin: {
    top: convertInchesToTwip(1),
    right: convertInchesToTwip(1),
    bottom: convertInchesToTwip(1),
    left: convertInchesToTwip(1.5)
  }
};