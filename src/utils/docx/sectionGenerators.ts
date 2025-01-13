import { 
  Document, 
  Paragraph, 
  TextRun, 
  PageBreak, 
  AlignmentType,
  HeadingLevel,
  TabStopPosition,
  TabStopType,
  convertInchesToTwip,
  LevelFormat,
  NumberFormat,
  TableRow,
  TableCell,
  Table,
  WidthType,
  BorderStyle,
  ImageRun
} from 'docx';
import { TitlePageOptions, ThesisMetadata } from './types';
import { createImageRun } from './imageUtils';

export const generateTitlePage = (options: TitlePageOptions): Paragraph[] => [
  new Paragraph({
    style: 'Title',
    children: [
      new TextRun({
        text: options.title.toUpperCase(),
        bold: true,
        size: 32,
        font: "Times New Roman"
      }),
    ],
    alignment: AlignmentType.LEFT,
    spacing: { 
      before: convertInchesToTwip(2), 
      after: convertInchesToTwip(1),
      line: 360
    },
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: 'By',
        size: 28,
        break: 1
      }),
      new TextRun({
        text: options.author,
        size: 28,
        break: 2
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { 
      before: convertInchesToTwip(1),
      line: 360
    },
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: options.university || '',
        size: 28,
        break: 2
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { 
      before: convertInchesToTwip(1),
      line: 360
    },
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: options.department || '',
        size: 28,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { 
      before: convertInchesToTwip(0.5),
      line: 360
    },
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: 'A thesis submitted in partial fulfillment',
        size: 24,
        break: 2
      }),
      new TextRun({
        text: 'of the requirements for the degree of',
        size: 24,
        break: 1
      }),
      new TextRun({
        text: options.degree || '',
        size: 24,
        break: 2,
        bold: true
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { 
      before: convertInchesToTwip(1),
      line: 360
    },
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: options.date,
        size: 24,
        break: 2
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { 
      before: convertInchesToTwip(1),
      line: 360
    },
  }),
  new Paragraph({ 
    children: [new PageBreak()],
    spacing: { before: convertInchesToTwip(2) }
  }),
];

export const generateChapterContent = (
  chapterNumber: number,
  title: string,
  content: string,
  figures: any[]
): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      style: 'Heading1',
      children: [
        new TextRun({
          text: `CHAPTER ${chapterNumber}`,
          bold: true,
          size: 32
        }),
      ],
      spacing: {
        before: 480,
        after: 240,
        line: 360
      },
      pageBreakBefore: true,
      alignment: AlignmentType.LEFT,
    }),
    new Paragraph({
      style: 'Heading1',
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 32
        }),
      ],
      spacing: {
        before: 240,
        after: 360,
        line: 360
      },
      alignment: AlignmentType.LEFT,
    }),
  ];

  // Add content paragraphs
  if (typeof content === 'string') {
    content.split('\n\n').forEach(paragraph => {
      paragraphs.push(
        new Paragraph({
          style: 'Normal',
          children: [
            new TextRun({
              text: paragraph.trim(),
              size: 24
            }),
          ],
          spacing: {
            before: 240,
            after: 240,
            line: 360
          },
          indent: {
            firstLine: convertInchesToTwip(0.5)
          },
          alignment: AlignmentType.LEFT,
        })
      );
    });
  }

  // Add figures
  if (figures && figures.length > 0) {
    figures.forEach(figure => {
      if (figure.imageUrl) {
        paragraphs.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: Buffer.from(figure.imageUrl.split(',')[1], 'base64'),
                transformation: {
                  width: figure.dimensions.width,
                  height: figure.dimensions.height
                },
                alignment: figure.position || AlignmentType.CENTER
              })
            ],
            spacing: {
              before: 240,
              after: 120
            },
            alignment: figure.position === 'left' ? AlignmentType.LEFT : 
                      figure.position === 'right' ? AlignmentType.RIGHT : 
                      AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Figure ${figure.number}: ${figure.caption || ''}`,
                italics: true,
                size: 20
              })
            ],
            spacing: {
              before: 120,
              after: 240
            },
            alignment: AlignmentType.CENTER
          })
        );
      }
    });
  }

  return paragraphs;
};

export const generateTableOfContents = (sections: { title: string; page: number }[]): Paragraph[] => {
  const tabStops = [
    {
      type: TabStopType.RIGHT,
      position: TabStopPosition.MAX,
      leader: TabStopType.DOT
    }
  ];

  return [
    new Paragraph({
      style: 'Title',
      children: [
        new TextRun({
          text: 'TABLE OF CONTENTS',
          bold: true,
          size: 32
        }),
      ],
      spacing: { before: 720, after: 480 },
      alignment: AlignmentType.CENTER,
    }),
    ...sections.map(section => 
      new Paragraph({
        style: 'TableOfContents',
        tabStops,
        children: [
          new TextRun({
            text: section.title,
            size: 24
          }),
          new TextRun({
            text: '\t',
          }),
          new TextRun({
            text: section.page.toString(),
            size: 24
          }),
        ],
        spacing: {
          before: 240,
          after: 240,
          line: 360
        },
        indent: {
          left: convertInchesToTwip(section.title.startsWith('Chapter') ? 0 : 0.5)
        }
      })
    ),
    new Paragraph({ 
      children: [new PageBreak()],
      spacing: { before: convertInchesToTwip(1) }
    }),
  ];
};

// New helper functions for additional sections

export const generateListOfFigures = (figures: { title: string; page: number }[]): Paragraph[] => {
  const tabStops = [
    {
      type: TabStopType.RIGHT,
      position: TabStopPosition.MAX,
      leader: TabStopType.DOT
    }
  ];

  return [
    new Paragraph({
      style: 'Title',
      children: [new TextRun({ text: 'LIST OF FIGURES', bold: true, size: 32 })],
      spacing: { before: 720, after: 480 },
      alignment: AlignmentType.CENTER,
    }),
    ...figures.map(figure => 
      new Paragraph({
        style: 'TableOfContents',
        tabStops,
        children: [
          new TextRun({ text: figure.title, size: 24 }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: figure.page.toString(), size: 24 }),
        ],
        spacing: { before: 240, after: 240, line: 360 }
      })
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
};

export const generateListOfTables = (tables: { title: string; page: number }[]): Paragraph[] => {
  // Similar to List of Figures implementation
  // Add implementation here
  return [];
};

export const generateAcknowledgments = (content: string): Paragraph[] => {
  return [
    new Paragraph({
      style: 'Title',
      children: [new TextRun({ text: 'ACKNOWLEDGMENTS', bold: true, size: 32 })],
      spacing: { before: 720, after: 480 },
      alignment: AlignmentType.CENTER,
    }),
    ...content.split('\n\n').map(paragraph => 
      new Paragraph({
        style: 'Normal',
        children: [new TextRun({ text: paragraph.trim(), size: 24 })],
        spacing: { before: 240, after: 240, line: 360 },
        indent: { firstLine: convertInchesToTwip(0.5) }
      })
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
};
