import { Document, Paragraph, TextRun, PageBreak, Header, Footer, AlignmentType, LevelFormat, HeadingLevel, PageNumber, Table as DocxTable, TableRow, TableCell, VerticalAlign, WidthType, ImageRun, convertInchesToTwip, BorderStyle } from "docx";
import { MarkdownToDocx } from './markdownToDocx';
import { documentStyles, pageSettings } from './documentStyles';
import { Thesis, Section, Chapter, Figure, Table, Reference, Citation } from '@/types/thesis';

const defaultFont = "Times New Roman";
const defaultFontSize = 24; // 12pt

const createHeader = (thesis: Thesis) => {
  return new Header({
    children: [
      new Paragraph({
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: thesis.metadata?.shortTitle || "Running head",
            font: defaultFont,
            size: defaultFontSize
          }),
          new TextRun({ text: "\t", children: [new TextRun({ text: "" })] }),
          new TextRun({
            text: String(PageNumber.CURRENT),
            font: defaultFont,
            size: defaultFontSize
          })
        ],
      }),
    ],
  });
};

const createFooter = () => {
  return new Footer({
    children: [
      new Paragraph({
        border: {
          top: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { before: 200 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: String(PageNumber.CURRENT),
            font: defaultFont,
            size: defaultFontSize
          })
        ],
      }),
    ],
  });
};

const createTitlePage = (thesis: Thesis) => {
  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 480 },
      children: [
        new TextRun({
          text: thesis.metadata?.institution || "",
          font: defaultFont,
          size: 28
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 720 },
      children: [
        new TextRun({
          text: titleSection?.title || "Untitled Thesis",
          font: defaultFont,
          size: 40,
          bold: true
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 720 },
      children: [
        new TextRun({
          text: `By\n${thesis.metadata?.author || ""}`,
          font: defaultFont,
          size: 28
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2880 },
      children: [
        new TextRun({
          text: `A thesis submitted in partial fulfillment\nof the requirements for the degree of\n${thesis.metadata?.degree || ""}`,
          font: defaultFont,
          size: defaultFontSize
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2880 },
      children: [
        new TextRun({
          text: thesis.metadata?.date || new Date().getFullYear().toString(),
          font: defaultFont,
          size: defaultFontSize
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
};

const createAbstract = (thesis: Thesis) => {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 720, after: 480 },
      children: [
        new TextRun({
          text: "ABSTRACT",
          font: defaultFont,
          size: 32,
          bold: true
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { line: 480 },
      children: [
        new TextRun({
          text: thesis.metadata?.description || "",
          font: defaultFont,
          size: defaultFontSize
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 720 },
      children: [
        new TextRun({
          text: `Keywords: ${thesis.metadata?.keywords?.join(', ')}`,
          font: defaultFont,
          size: defaultFontSize,
          italic: true
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
};

const createChapterContentWithSections = (chapter: Chapter) => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 720, after: 480 },
      children: [
        new TextRun({
          text: `CHAPTER ${chapter.order}. ${chapter.title}`,
          font: defaultFont,
          size: 32,
          bold: true
        }),
      ],
    })
  ];

  chapter.sections.forEach((section) => {
    paragraphs.push(...createSectionContent(section));
  });

  return paragraphs;
};

const createSectionContent = (section: Section) => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 480, after: 240 },
      children: [
        new TextRun({
          text: section.title,
          font: defaultFont,
          size: 28,
          bold: true
        }),
      ],
    })
  ];

  const markdown = new MarkdownToDocx();
  const contentParagraphs = markdown.convert(section.content, defaultFont, defaultFontSize);
  paragraphs.push(...contentParagraphs);

  return paragraphs;
};

export const generateThesisDocx = (thesis: Thesis): Document => {
  const doc = new Document({
    styles: documentStyles,
    sections: [
      {
        properties: {
          page: pageSettings
        },
        headers: { default: createHeader(thesis) },
        footers: { default: createFooter() },
        children: [
          ...createTitlePage(thesis),
          ...createAbstract(thesis),
          ...thesis.chapters.flatMap(chapter => createChapterContentWithSections(chapter))
        ]
      }
    ]
  });

  return doc;
};

export const generatePreviewDocx = (thesis: Thesis) => {
  const doc = new Document({
    styles: documentStyles,
    sections: [
      {
        properties: {
          page: pageSettings
        },
        children: [
          ...createTitlePage(thesis),
          ...createAbstract(thesis),
          ...thesis.chapters.flatMap(chapter => createChapterContentWithSections(chapter))
        ]
      }
    ]
  });
  return doc;
};
