import { Document, Paragraph, TextRun, PageBreak, Header, Footer, AlignmentType, LevelFormat, HeadingLevel, PageNumber, Table as DocxTable, TableRow, TableCell, VerticalAlign, WidthType, ImageRun, convertInchesToTwip, BorderStyle } from "docx";
import { MarkdownToDocx } from './markdownToDocx';
import { documentStyles, pageSettings } from './documentStyles';
import { createImage } from './imageUtils';
import { createParagraph, createHeading } from './contentGenerators';
import { generateTitlePage } from './titlePageGenerator';
import { Figure, Table, Citation, Reference, Section, Chapter } from '@/types/thesis';

const defaultFont = "Times New Roman";
const defaultFontSize = 24; //12pt

const createHeader = () => {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            children: ["Running head: ", PageNumber.CURRENT],
            font: defaultFont,
            size: defaultFontSize,
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
            font: defaultFont,
            size: defaultFontSize,
          }),
        ],
      }),
    ],
  });
};

const createAbstract = (thesis) => {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Abstract",
          bold: true,
          font: defaultFont,
          size: 32,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: thesis.metadata?.description || "",
          font: defaultFont,
          size: defaultFontSize,
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
          font: defaultFont,
          size: 32,
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
};

const createFigures = (figures: Figure[]) => {
  return figures.flatMap((figure) => {
    const paragraphs: Paragraph[] = [];
    if (figure.imageUrl) {
      try {
        paragraphs.push(
          createImage({
            data: Buffer.from(figure.imageUrl.split(',')[1], 'base64'),
            width: convertInchesToTwip(5),
            height: convertInchesToTwip(3.75),
            type: 'image/png',
            fallback: 'Image'
          })
        );
      } catch (e) {
        console.log(`Error loading image: ${figure.imageUrl}`);
        paragraphs.push(createParagraph(`Error loading image: ${figure.imageUrl}`, {
          font: defaultFont,
          fontSize: defaultFontSize
        }));
      }
    }
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Figure ${figure.number}. ${figure.caption}`,
            italics: true,
            font: defaultFont,
            size: defaultFontSize,
          }),
        ],
      })
    );
    return paragraphs;
  });
};

const createTables = (tables: Table[]) => {
  return tables.map(table => {
    const headerRow = new TableRow({
      children: table.headers.map(header =>
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: header,
                  bold: true,
                  font: defaultFont,
                  size: defaultFontSize,
                }),
              ],
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          width: {
            size: 2400,
            type: WidthType.DXA,
          },
          shading: {
            fill: "EDEDED",
            color: "auto",
            type: "solid",
          },
        })
      ),
    });

    const dataRows = table.rows.map(row => new TableRow({
      children: row.map(cell => new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: cell,
                font: defaultFont,
                size: defaultFontSize,
              }),
            ],
          }),
        ],
        verticalAlign: VerticalAlign.CENTER,
        width: {
          size: 2400,
          type: WidthType.DXA,
        },
      })),
    }));

    return new DocxTable({
      rows: [headerRow, ...dataRows],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      properties: {
        style: 'TableGrid',
        layout: "autofit",
      },
      margins: {
        top: 720,
        bottom: 720,
      },
    });
  });
};

const createCitations = (citations: Citation[]) => {
  return citations.map(citation => new Paragraph({
    children: [
      new TextRun({
        text: `(${citation.authors.join(', ')}, ${citation.year}): ${citation.text}, ${citation.source}`,
        font: defaultFont,
        size: defaultFontSize,
      }),
    ],
  }));
};

const createReferences = (references: Reference[]) => {
  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: "References",
          bold: true,
          font: defaultFont,
          size: 28,
        }),
      ],
    }),
  ];

  references.forEach((reference) => {
    let citationText = "";

    if (reference.type === 'article') {
      citationText = `${reference.authors.join(', ')}. (${reference.year}). ${reference.title}. ${reference.journal}, ${reference.volume}(${reference.issue}), ${reference.pages}. ${reference.doi ? `doi: ${reference.doi}` : ""}`;
    } else if (reference.type === 'book') {
      citationText = `${reference.authors.join(', ')}. (${reference.year}). ${reference.title}. ${reference.publisher}. ${reference.doi ? `doi: ${reference.doi}` : ""}`;
    } else if (reference.type === 'website' || reference.type === 'other') {
      citationText = `${reference.authors.join(', ')}. (${reference.year}). ${reference.title}. ${reference.url} ${reference.doi ? `doi: ${reference.doi}` : ""}`;
    } else {
      citationText = `${reference.authors.join(', ')}. (${reference.year}). ${reference.title}. ${reference.doi ? `doi: ${reference.doi}` : ""}`;
    }

    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: citationText,
          font: defaultFont,
          size: defaultFontSize,
        }),
      ],
    }));
  });

  return paragraphs;
};

const createSectionContent = (section: Section) => {
  const paragraphs: Paragraph[] = [];
  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: section.title,
          bold: true,
          font: defaultFont,
          size: 28,
        }),
      ],
    })
  );

  const markdown = new MarkdownToDocx();
  const contentParagraphs = markdown.convert(section.content, defaultFont, defaultFontSize);
  paragraphs.push(...contentParagraphs);

  paragraphs.push(...createFigures(section.figures));
  paragraphs.push(...createTables(section.tables));
  paragraphs.push(...createCitations(section.citations));
  if (section.type === 'references' && section.references) {
    paragraphs.push(...createReferences(section.references));
  }

  return paragraphs;
};

const createChapterContentWithSections = (chapter: Chapter) => {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: chapter.title,
          bold: true,
          font: defaultFont,
          size: 32,
        }),
      ],
    })
  );

  chapter.sections.forEach((section) => {
    paragraphs.push(...createSectionContent(section));
  });

  return paragraphs;
};

export const generateThesisDocx = (thesis) => {
  const doc = new Document({
    styles: documentStyles,
    sections: [
      {
        properties: {
          page: pageSettings,
        },
        headers: {
          default: createHeader(),
        },
        footers: {
          default: createFooter(),
        },
        children: [
          ...generateTitlePage({
            title: thesis.frontMatter[0]?.title || "Untitled Thesis",
            author: thesis.metadata?.authorName || "Unknown Author",
            date: thesis.metadata?.thesisDate || new Date().toLocaleDateString(),
            university: thesis.metadata?.universityName,
            department: thesis.metadata?.departmentName,
          }),
          ...createAbstract(thesis),
          ...createTableOfContents(),
          ...thesis.chapters.flatMap(chapter => createChapterContentWithSections(chapter)),
          ...thesis.backMatter.flatMap(section => createSectionContent(section)),
        ],
      },
    ],
  });

  return doc;
};

export const generatePreviewDocx = (thesis) => {
  const doc = new Document({
    styles: documentStyles,
    sections: [{
      properties: {
        page: pageSettings,
      },
      children: [
        ...generateTitlePage({
          title: thesis.frontMatter[0]?.title || "Untitled Thesis",
          author: thesis.metadata?.authorName || "Unknown Author",
          date: thesis.metadata?.thesisDate || new Date().toLocaleDateString(),
        }),
        ...createAbstract(thesis),
        ...thesis.chapters.flatMap(chapter => createChapterContentWithSections(chapter)),
      ],
    }],
  });

  return doc;
};
