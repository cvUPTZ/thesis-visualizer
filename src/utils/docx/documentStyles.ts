import { convertInchesToTwip, IStylesOptions, HeadingLevel } from 'docx';

// Standard margins (1.5 inches left, 1 inch others)
export const pageSettings = {
  margin: {
    top: convertInchesToTwip(1),
    right: convertInchesToTwip(1),
    bottom: convertInchesToTwip(1),
    left: convertInchesToTwip(1.5) // Increased for binding
  }
};

// Preliminary pages with Roman numerals
export const preliminaryPageSettings = {
  ...pageSettings,
  pageNumbers: {
    start: 1,
    formatType: 'lowerRoman'
  }
};

// Main content pages with Arabic numerals
export const mainPageSettings = {
  ...pageSettings,
  pageNumbers: {
    start: 1,
    formatType: 'decimal'
  }
};

export const documentStyles: IStylesOptions = {
  default: {
    document: {
      run: {
        font: 'Times New Roman',
        size: 24, // 12pt
      },
      paragraph: {
        spacing: {
          line: 360, // 1.5 spacing
          before: 0,
          after: 0
        },
        indent: {
          firstLine: convertInchesToTwip(0.5)
        }
      }
    }
  },
  paragraphStyles: [
    {
      id: 'Normal',
      name: 'Normal',
      run: {
        font: 'Times New Roman',
        size: 24 // 12pt
      },
      paragraph: {
        spacing: { 
          line: 360, // 1.5 spacing
          before: 0,
          after: 0
        },
        indent: {
          firstLine: convertInchesToTwip(0.5)
        }
      }
    },
    {
      id: 'Heading1',
      name: 'Chapter Heading',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        font: 'Times New Roman',
        size: 32, // 16pt
        bold: true,
        allCaps: true
      },
      paragraph: {
        spacing: {
          before: 480,
          after: 240
        },
        alignment: 'center'
      }
    },
    {
      id: 'Title',
      name: 'Title',
      basedOn: 'Normal',
      run: {
        font: 'Times New Roman',
        size: 32, // 16pt
        bold: true,
        allCaps: true
      },
      paragraph: {
        spacing: {
          before: 720,
          after: 240
        },
        alignment: 'center'
      }
    },
    {
      id: 'Subtitle',
      name: 'Subtitle',
      basedOn: 'Normal',
      run: {
        size: 28, // 14pt
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 480
        },
        alignment: 'center'
      }
    },
    {
      id: 'BlockQuote',
      name: 'Block Quote',
      basedOn: 'Normal',
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
      id: 'Caption',
      name: 'Caption',
      basedOn: 'Normal',
      run: {
        size: 20 // 10pt
      },
      paragraph: {
        spacing: { 
          line: 240, // single spacing
          before: 120,
          after: 120
        },
        alignment: 'center'
      }
    },
    {
      id: 'TableOfContents',
      name: 'Table of Contents',
      basedOn: 'Normal',
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          line: 480, // double spacing
          before: 0,
          after: 0
        }
      }
    },
    {
      id: 'Abstract',
      name: 'Abstract',
      basedOn: 'Normal',
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          line: 240, // single spacing
          before: 0,
          after: 0
        },
        indent: {
          firstLine: 0
        }
      }
    }
  ]
};