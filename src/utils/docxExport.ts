import { Document, Paragraph, TextRun, PageBreak, Header, Footer, AlignmentType, LevelFormat, HeadingLevel, PageNumber, PageNumberFormat } from 'docx';
import { Thesis, Section, Chapter } from '@/types/thesis';

const createHeader = () => {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            children: ["Running head: ", PageNumber.CURRENT],
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
      }),
    ],
  });
};

const createFooter = () => {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            font: "Times New Roman",
            size: 24, // 12pt
          }),
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
      spacing: { before: 1440, after: 1440 }, // 1 inch margins
      children: [
        new TextRun({
          text: titleSection?.title || "Untitled Thesis",
          bold: true,
          font: "Times New Roman",
          size: 32, // 16pt
        }),
      ],
    }),
    new Paragraph({
      text: "",
      break: 1,
    }),
  ];
};

const createAbstract = (thesis: Thesis) => {
  const abstractSection = thesis.frontMatter.find(section => section.type === 'abstract');
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Abstract",
          bold: true,
          font: "Times New Roman",
          size: 24, // 12pt
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: abstractSection?.content || "",
          font: "Times New Roman",
          size: 24, // 12pt
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
};

const createTableOfContents = () => {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Table of Contents",
          bold: true,
          font: "Times New Roman",
          size: 24,
        }),
      ],
    }),
    // Table of contents will be auto-generated by Word
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
};

const createChapterContent = (chapter: Chapter) => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: chapter.title,
          bold: true,
          font: "Times New Roman",
          size: 28, // 14pt
        }),
      ],
    }),
  ];

  chapter.sections.forEach(section => {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: section.title,
            bold: true,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: section.content,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
      })
    );
  });

  return paragraphs;
};

export const generateThesisDocx = (thesis: Thesis): Document => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch in twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: createHeader(),
        },
        footers: {
          default: createFooter(),
        },
        children: [
          ...createTitlePage(thesis),
          ...createAbstract(thesis),
          ...createTableOfContents(),
          ...thesis.chapters.flatMap(chapter => createChapterContent(chapter)),
        ],
      },
    ],
    numbering: {
      config: [
        {
          reference: "heading1",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
  });

  return doc;
};