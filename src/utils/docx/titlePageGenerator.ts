import { 
  IStylesOptions, 
  BorderStyle, 
  HeadingLevel, 
  AlignmentType,
  LineRuleType,
  UnderlineType,
  convertInchesToTwip
} from 'docx';

export const styleConfig: IStylesOptions = {
  default: {
    document: {
      run: {
        font: "Times New Roman",
        size: 24,
        language: {
          value: "en-US"
        }
      },
      paragraph: {
        spacing: {
          line: 360,
          lineRule: LineRuleType.AUTO
        }
      }
    }
  },
  paragraphStyles: [
    {
      id: "Normal",
      name: "Normal",
      quickFormat: true,
      run: {
        font: "Times New Roman",
        size: 24,
        color: "000000"
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
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        bold: true,
        size: 32,
        allCaps: true
      },
      paragraph: {
        spacing: {
          before: 480,
          after: 240,
          line: 360
        },
        keepNext: true,
        keepLines: true,
        outlineLevel: 0,
        alignment: AlignmentType.CENTER
      }
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        bold: true,
        size: 28
      },
      paragraph: {
        spacing: {
          before: 360,
          after: 180,
          line: 360
        },
        keepNext: true,
        keepLines: true,
        outlineLevel: 1
      }
    },
    {
      id: "Heading3",
      name: "Heading 3",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        bold: true,
        italics: true,
        size: 26
      },
      paragraph: {
        spacing: {
          before: 280,
          after: 140,
          line: 360
        },
        keepNext: true,
        outlineLevel: 2
      }
    },
    {
      id: "BlockQuote",
      name: "Block Quote",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        italics: true,
        size: 24
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 240,
          line: 300
        },
        indent: {
          left: convertInchesToTwip(0.5),
          right: convertInchesToTwip(0.5)
        },
        alignment: AlignmentType.JUSTIFY
      }
    },
    {
      id: "Caption",
      name: "Caption",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        italics: true,
        size: 20
      },
      paragraph: {
        spacing: {
          before: 120,
          after: 240,
          line: 240
        },
        alignment: AlignmentType.CENTER
      }
    },
    {
      id: "TableHeader",
      name: "Table Header",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        bold: true,
        size: 24
      },
      paragraph: {
        spacing: {
          before: 120,
          after: 120,
          line: 240
        },
        alignment: AlignmentType.CENTER
      }
    },
    {
      id: "TableBody",
      name: "Table Body",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          before: 60,
          after: 60,
          line: 240
        }
      }
    },
    {
      id: "FootnoteText",
      name: "Footnote Text",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        size: 20
      },
      paragraph: {
        spacing: {
          before: 0,
          after: 0,
          line: 240
        },
        indent: {
          firstLine: convertInchesToTwip(0.25)
        }
      }
    },
    {
      id: "Bibliography",
      name: "Bibliography",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          before: 0,
          after: 120,
          line: 360
        },
        indent: {
          left: convertInchesToTwip(0.5),
          hanging: convertInchesToTwip(0.5)
        }
      }
    },
    {
      id: "TOCHeading",
      name: "TOC Heading",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        bold: true,
        size: 28
      },
      paragraph: {
        spacing: {
          before: 480,
          after: 240,
          line: 360
        },
        alignment: AlignmentType.CENTER
      }
    },
    {
      id: "TOCEntry1",
      name: "TOC Entry 1",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          line: 360
        },
        indent: {
          left: 0
        }
      }
    },
    {
      id: "TOCEntry2",
      name: "TOC Entry 2",
      basedOn: "Normal",
      quickFormat: true,
      run: {
        size: 24
      },
      paragraph: {
        spacing: {
          line: 360
        },
        indent: {
          left: convertInchesToTwip(0.25)
        }
      }
    }
  ]
};