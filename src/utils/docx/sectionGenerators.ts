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
import { Buffer } from 'buffer';
import { TitlePageOptions } from './types';
import { createImageRun } from './imageUtils';

export const generateTitlePage = (options: TitlePageOptions): Paragraph[] => [
  new Paragraph({
    children: [
      new TextRun({
        text: options.title.toUpperCase(),
        bold: true,
        size: 32,
        font: "Times New Roman"
      }),
    ],
    alignment: AlignmentType.LEFT,
  }),
  new Paragraph({
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
    alignment: AlignmentType.LEFT,
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
      children: [
        new TextRun({
          text: `CHAPTER ${chapterNumber}`,
          bold: true,
          size: 32
        }),
      ],
      pageBreakBefore: true,
      alignment: AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 32
        }),
      ],
      alignment: AlignmentType.LEFT,
    }),
  ];

  // Add content paragraphs
  if (typeof content === 'string') {
    content.split('\n\n').forEach(paragraph => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph.trim(),
              size: 24
            }),
          ],
          alignment: AlignmentType.LEFT,
        })
      );
    });
  }

  // Add figures
  if (figures && figures.length > 0) {
    figures.forEach(figure => {
      if (figure.imageUrl) {
        try {
          // Extract base64 data from data URL
          const base64Data = figure.imageUrl.split(',')[1];
          if (!base64Data) {
            console.warn('Invalid image URL format:', figure.imageUrl);
            return;
          }

          const imageBuffer = Buffer.from(base64Data, 'base64');
          
          const imageRun = new ImageRun({
            data: imageBuffer,
            transformation: {
              width: figure.dimensions?.width || 400,
              height: figure.dimensions?.height || 300
            }
          });

          paragraphs.push(
            new Paragraph({
              children: [imageRun],
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
              alignment: AlignmentType.CENTER
            })
          );
        } catch (error) {
          console.error('Error processing figure:', error);
        }
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
      leader: TabStopType.DECIMAL
    }
  ];

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: 'TABLE OF CONTENTS',
          bold: true,
          size: 32
        }),
      ],
      alignment: AlignmentType.LEFT,
    }),
    ...sections.map(section => 
      new Paragraph({
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
        alignment: AlignmentType.LEFT,
      })
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
};
