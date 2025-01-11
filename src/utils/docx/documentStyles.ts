import { 
  convertInchesToTwip, 
  IStylesOptions, 
  HeadingLevel,
  UnderlineType,
  LineRuleType
} from 'docx';

// Advanced page settings with different options for different page orientations
export const pageSettings = {
  margin: {
    top: convertInchesToTwip(1),
    right: convertInchesToTwip(1),
    bottom: convertInchesToTwip(1),
    left: convertInchesToTwip(1.5)
  },
  pageSize: {
    width: convertInchesToTwip(8.5),
    height: convertInchesToTwip(11)
  }
};

// Landscape orientation for wide tables/figures
export const landscapePageSettings = {
  ...pageSettings,
  pageSize: {
    width: convertInchesToTwip(11),
    height: convertInchesToTwip(8.5)
  }
};

export const preliminaryPageSettings = {
  ...pageSettings,
  pageNumbers: {
    start: 1,
    formatType: 'lowerRoman'
  }
};

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
        size: 24,
        language: {
          value: 'en-US'
        }
      },
      paragraph: {
        spacing: {
          line: 360,
          before: 0,
          after: 0,
          lineRule: LineRuleType.AUTO
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
        size: 24,
        color: '000000'
      },
      paragraph: {
        spacing: { 
          line: 360,
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
      quickFormat: true,
      run: {
        font: 'Times New Roman',
        size: 32,
        bold: true,
        allCaps: true,
        color: '000000'
      },
      paragraph: {
        spacing: {
          before: 480,
          after: 240,
          line: 360
        },
        alignment: 'center',
        outlineLevel: 0
      }
    },
    {
      id: 'Heading2',
      name: 'Section Heading',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        size: 28,
        bold: true,
        color: '000000'
      },
      paragraph: {
        spacing: {
          before: 360,
          after: 180
        },
        outlineLevel: 1
      }
    },
    {
      id: 'Heading3',
      name: 'Subsection Heading',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        size: 26,
        bold: true,
        italics: true
      },
      paragraph: {
        spacing: {
          before: 280,
          after: 140
        },
        outlineLevel: 2
      }
    },
    {
      id: 'Title',
      name: 'Title',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        font: 'Times New Roman',
        size: 36,
        bold: true,
        allCaps: true
      },
      paragraph: {
        spacing: {
          before: 720,
          after: 240,
          line: 480
        },
        alignment: 'center'
      }
    },
    {
      id: 'Subtitle',
      name: 'Subtitle',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        size: 28
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 480,
          line: 360
        },
        alignment: 'center'
      }
    },
    {
      id: 'BlockQuote',
      name: 'Block Quote',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        size: 24,
        italics: true
      },
      paragraph: {
        spacing: { 
          line: 240,
          before: 240,
          after: 240
        },
        indent: {
          left: convertInchesToTwip(1),
          right: convertInchesToTwip(1)
        },
        alignment: 'justify'
      }
    },
    {
      id: 'Caption',
      name: 'Caption',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        size: 20,
        italics: true
      },
      paragraph: {
        spacing: { 
          line: 240,
          before: 120,
          after: 240
        },
        alignment: 'center'
      }
    },
    {
      id: 'TableOfContents',
      name: 'Table of Contents',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          line: 360,
          before: 240,
          after: 240
        },
        indent: {
          left: 0,
          right: 0,
          firstLine: 0
        }
      }
    },
    {
      id: 'TOCEntry',
      name: 'TOC Entry',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          line: 360
        },
        indent: {
          left: convertInchesToTwip(0.25),
          hanging: convertInchesToTwip(0.25)
        }
      }
    },
    {
      id: 'Abstract',
      name: 'Abstract',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          line: 240,
          before: 240,
          after: 240
        },
        indent: {
          firstLine: 0
        }
      }
    },
    {
      id: 'Bibliography',
      name: 'Bibliography',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          line: 360,
          before: 0,
          after: 120
        },
        indent: {
          left: convertInchesToTwip(0.5),
          hanging: convertInchesToTwip(0.5)
        }
      }
    },
    {
      id: 'FootnoteText',
      name: 'Footnote Text',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        size: 20
      },
      paragraph: {
        spacing: {
          line: 240,
          before: 0,
          after: 0
        },
        indent: {
          firstLine: convertInchesToTwip(0.25)
        }
      }
    },
    {
      id: 'TableHeader',
      name: 'Table Header',
      basedOn: 'Normal',
      quickFormat: true,
      run: {
        bold: true,
        size: 24
      },
      paragraph: {
        spacing: {
          line: 240,
          before: 120,
          after: 120
        },
        alignment: 'center'
      }
    }
  ]
};