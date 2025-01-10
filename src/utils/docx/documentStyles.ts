import { IStylesOptions, convertInchesToTwip, BorderStyle } from "docx";

export const documentStyles: IStylesOptions = {
  paragraphStyles: [
    {
      id: "Normal",
      name: "Normal",
      run: {
        font: "Times New Roman",
        size: 24, // 12pt
      },
      paragraph: {
        spacing: { 
          line: 360, // 1.5 spacing
          before: 0,
          after: 0
        },
        indent: {
          firstLine: convertInchesToTwip(0.5) // 0.5 inch paragraph indent
        }
      }
    },
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      next: "Normal",
      run: {
        bold: true,
        size: 32, // 16pt
        allCaps: true
      },
      paragraph: {
        spacing: {
          before: 480,
          after: 240
        },
        alignment: "center"
      }
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      run: {
        bold: true,
        size: 28 // 14pt
      },
      paragraph: {
        spacing: {
          before: 360,
          after: 240
        }
      }
    },
    {
      id: "Caption",
      name: "Caption",
      basedOn: "Normal",
      run: {
        size: 20 // 10pt
      },
      paragraph: {
        spacing: { 
          line: 240, // single spacing
          before: 120,
          after: 240
        }
      }
    },
    {
      id: "BlockQuote",
      name: "Block Quote",
      basedOn: "Normal",
      run: {
        size: 24
      },
      paragraph: {
        spacing: { 
          line: 240, // single spacing
          before: 240,
          after: 240
        },
        indent: {
          left: convertInchesToTwip(0.5),
          right: convertInchesToTwip(0.5)
        }
      }
    },
    {
      id: "TOC",
      name: "Table of Contents",
      basedOn: "Normal",
      run: {
        size: 24
      },
      paragraph: {
        spacing: { 
          line: 360, // 1.5 spacing
          before: 120,
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
    left: convertInchesToTwip(1.5) // Increased for binding
  },
  pageNumbers: {
    start: 1,
    formatType: 'decimal'
  }
};

export const preliminaryPageSettings = {
  ...pageSettings,
  pageNumbers: {
    start: 1,
    formatType: 'lowerRoman'
  }
};