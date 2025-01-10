import { Document, Paragraph, TextRun, PageBreak, AlignmentType, HeadingLevel } from 'docx';
import { TitlePageOptions, ThesisMetadata } from './types';
import { convertInchesToTwip } from 'docx';

export const generateTitlePage = (options: TitlePageOptions): Paragraph[] => [
  new Paragraph({
    style: 'Title',
    children: [
      new TextRun({
        text: options.title.toUpperCase(),
        bold: true,
        size: 32, // 16pt
      }),
    ],
    spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: `By\n${options.author}`,
        size: 28, // 14pt
      }),
    ],
    spacing: { before: convertInchesToTwip(1) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: options.university || '',
        size: 28,
      }),
    ],
    spacing: { before: convertInchesToTwip(1) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: options.department || '',
        size: 28,
      }),
    ],
    spacing: { before: convertInchesToTwip(0.5) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: `A thesis submitted in partial fulfillment\nof the requirements for the degree of\n${options.degree || ''}`,
        size: 24,
      }),
    ],
    spacing: { before: convertInchesToTwip(1) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    style: 'Subtitle',
    children: [
      new TextRun({
        text: options.date,
        size: 24,
      }),
    ],
    spacing: { before: convertInchesToTwip(1) },
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({ children: [new PageBreak()] }),
];

export const generateAbstractSection = (content: string): Paragraph[] => [
  new Paragraph({
    style: 'Title',
    children: [
      new TextRun({
        text: 'ABSTRACT',
        bold: true,
      }),
    ],
    spacing: { before: 720, after: 480 },
    alignment: AlignmentType.CENTER,
  }),
  ...content.split('\n').map(paragraph => 
    new Paragraph({
      style: 'Abstract',
      children: [
        new TextRun({
          text: paragraph,
        }),
      ],
    })
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

export const generateChapterContent = (
  chapterNumber: number,
  title: string,
  content: string
): Paragraph[] => [
  new Paragraph({
    style: 'Heading1',
    children: [
      new TextRun({
        text: `CHAPTER ${chapterNumber}`,
        bold: true,
      }),
    ],
  }),
  new Paragraph({
    style: 'Heading1',
    children: [
      new TextRun({
        text: title,
        bold: true,
      }),
    ],
  }),
  ...content.split('\n').map(paragraph =>
    new Paragraph({
      style: 'Normal',
      children: [
        new TextRun({
          text: paragraph,
        }),
      ],
    })
  ),
];

export const generateTableOfContents = (sections: { title: string; page: number }[]): Paragraph[] => [
  new Paragraph({
    style: 'Title',
    children: [
      new TextRun({
        text: 'TABLE OF CONTENTS',
        bold: true,
      }),
    ],
    spacing: { before: 720, after: 480 },
    alignment: AlignmentType.CENTER,
  }),
  ...sections.map(section => 
    new Paragraph({
      style: 'TableOfContents',
      children: [
        new TextRun({
          text: section.title,
        }),
        new TextRun({
          text: `.`.repeat(50),
        }),
        new TextRun({
          text: section.page.toString(),
        }),
      ],
    })
  ),
  new Paragraph({ children: [new PageBreak()] }),
];