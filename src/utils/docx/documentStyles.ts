import { AlignmentType, IStylesOptions } from 'docx';

export const documentStyles: IStylesOptions = {
  default: {
    document: {
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        alignment: AlignmentType.BOTH,
        spacing: {
          after: 200,
          line: 276,
          lineRule: 'auto',
        },
      },
    },
    heading1: {
      run: {
        font: 'Times New Roman',
        size: 32,
        bold: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 240,
          after: 240,
        },
      },
    },
    heading2: {
      run: {
        font: 'Times New Roman',
        size: 28,
        bold: true,
      },
      paragraph: {
        alignment: AlignmentType.START,
        spacing: {
          before: 240,
          after: 120,
        },
      },
    },
    heading3: {
      run: {
        font: 'Times New Roman',
        size: 26,
        bold: true,
      },
      paragraph: {
        alignment: AlignmentType.START,
        spacing: {
          before: 240,
          after: 120,
        },
      },
    },
    listParagraph: {
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        alignment: AlignmentType.START,
        indent: {
          left: 720,
        },
        spacing: {
          line: 276,
          lineRule: 'auto',
        },
      },
    },
    footnote: {
      run: {
        font: 'Times New Roman',
        size: 20,
      },
      paragraph: {
        spacing: {
          line: 240,
          lineRule: 'auto',
        },
      },
    },
    caption: {
      run: {
        font: 'Times New Roman',
        size: 22,
        italic: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 120,
          after: 120,
        },
      },
    },
    tableHeader: {
      run: {
        font: 'Times New Roman',
        size: 24,
        bold: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 100,
          after: 100,
        },
      },
    },
    tableCell: {
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        alignment: AlignmentType.START,
        spacing: {
          before: 100,
          after: 100,
        },
      },
    },
    pageNumber: {
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
      },
    },
    abstract: {
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        alignment: AlignmentType.BOTH,
        spacing: {
          before: 240,
          after: 240,
          line: 276,
          lineRule: 'auto',
        },
      },
    },
    bibliography: {
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        alignment: AlignmentType.START,
        indent: {
          hanging: 720,
        },
        spacing: {
          line: 276,
          lineRule: 'auto',
        },
      },
    },
    appendix: {
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        alignment: AlignmentType.START,
        spacing: {
          before: 240,
          after: 240,
          line: 276,
          lineRule: 'auto',
        },
      },
    },
  },
  paragraphStyles: [
    {
      id: 'Normal',
      name: 'Normal',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'Times New Roman',
        size: 24,
      },
      paragraph: {
        alignment: AlignmentType.BOTH,
        spacing: {
          after: 200,
          line: 276,
          lineRule: 'auto',
        },
      },
    },
    {
      id: 'Title',
      name: 'Title',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'Times New Roman',
        size: 36,
        bold: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 240,
          after: 240,
        },
      },
    },
  ],
};