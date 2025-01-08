// src/utils/docxExport.ts

import {
  Document,
  Paragraph,
  TextRun,
  PageBreak,
  Header,
  Footer,
  AlignmentType,
  LevelFormat,
  HeadingLevel,
  PageNumber,
  NumberFormat,
  Table as DocxTable,
  TableRow,
  TableCell,
  TableProperties,
  VerticalAlign,
  WidthType,
  ImageRun,
  convertInchesToTwip,
  Spacing,
  Border,
  BorderStyle,
  LineNumberType,
  Tab,
  TableOfContents,
  StyleLevel,
  LineRuleType,
  TextDirection,
  SectionType,
  IParagraphOptions,
  IRunOptions
} from "docx";

import { 
  Thesis, 
  Section, 
  Chapter, 
  Figure, 
  Table, 
  Reference, 
  Citation,
  ThesisMetadata 
} from "@/types/thesis";

import { MarkdownToDocx } from './markdownToDocx';

// Constants
const defaultFont = "Times New Roman";
const defaultFontSize = 24; // 12pt
const headingOneSize = 32; // 16pt
const headingTwoSize = 28; // 14pt
const lineSpacing = 480; // Double spacing (24pt)

interface StyleOptions {
  font: string;
  size: number;
  bold?: boolean;
  italic?: boolean;
}

// Utility functions for consistent styling
const createStyledRun = (text: string, options: StyleOptions): TextRun => {
  return new TextRun({
    text,
    font: options.font,
    size: options.size,
    bold: options.bold,
    italic: options.italic,
  });
};

const createStyledParagraph = (
  text: string, 
  options: StyleOptions, 
  alignment: AlignmentType = AlignmentType.LEFT,
  spacing?: Spacing
): Paragraph => {
  return new Paragraph({
    alignment,
    spacing: spacing || { line: lineSpacing },
    children: [createStyledRun(text, options)]
  });
};

// Header and Footer
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
          createStyledRun(thesis.metadata?.shortTitle || "Running head", {
            font: defaultFont,
            size: defaultFontSize
          }),
          new TextRun({ text: "\t", children: [new Tab()] }),
          createStyledRun(String(PageNumber.CURRENT), {
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
          createStyledRun(String(PageNumber.CURRENT), {
            font: defaultFont,
            size: defaultFontSize
          })
        ],
      }),
    ],
  });
};

// Front Matter Components
const createTitlePage = (thesis: Thesis) => {
  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  return [
    createStyledParagraph(
      thesis.metadata?.institution || "",
      { font: defaultFont, size: 28 },
      AlignmentType.CENTER,
      { before: 1440, after: 480 }
    ),
    createStyledParagraph(
      titleSection?.title || "Untitled Thesis",
      { font: defaultFont, size: 40, bold: true },
      AlignmentType.CENTER,
      { before: 1440, after: 720 }
    ),
    createStyledParagraph(
      `By\n${thesis.metadata?.author || ""}`,
      { font: defaultFont, size: 28 },
      AlignmentType.CENTER,
      { before: 720 }
    ),
    createStyledParagraph(
      `A thesis submitted in partial fulfillment\nof the requirements for the degree of\n${thesis.metadata?.degree || ""}`,
      { font: defaultFont, size: defaultFontSize },
      AlignmentType.CENTER,
      { before: 2880 }
    ),
    createStyledParagraph(
      thesis.metadata?.date || new Date().getFullYear().toString(),
      { font: defaultFont, size: defaultFontSize },
      AlignmentType.CENTER,
      { before: 2880 }
    ),
    new Paragraph({ children: [new PageBreak()] })
  ];
};

const createCopyrightPage = (thesis: Thesis) => {
  return [
    createStyledParagraph(
      `Copyright © ${thesis.metadata?.copyright}\nby\n${thesis.metadata?.author}\n${new Date().getFullYear()}\nAll Rights Reserved`,
      { font: defaultFont, size: defaultFontSize },
      AlignmentType.CENTER,
      { before: 4320 }
    ),
    new Paragraph({ children: [new PageBreak()] })
  ];
};

const createCommitteeSignatures = (committee?: { chair: string; members: string[] }) => {
  if (!committee) return [];
  
  const signatures: Paragraph[] = [
    createStyledParagraph(
      `Committee Chair: ${committee.chair}`,
      { font: defaultFont, size: defaultFontSize },
      AlignmentType.LEFT,
      { before: 1440, after: 720 }
    )
  ];

  committee.members.forEach(member => {
    signatures.push(
      createStyledParagraph(
        `Committee Member: ${member}`,
        { font: defaultFont, size: defaultFontSize },
        AlignmentType.LEFT,
        { before: 720 }
      )
    );
  });

  return signatures;
};


const createAbstract = (thesis: Thesis) => {
  return [
    createStyledParagraph(
      "ABSTRACT",
      { font: defaultFont, size: headingOneSize, bold: true },
      AlignmentType.CENTER,
      { before: 720, after: 480 }
    ),
    createStyledParagraph(
      thesis.metadata?.description || "",
      { font: defaultFont, size: defaultFontSize },
      AlignmentType.LEFT,
      { line: lineSpacing }
    ),
    createStyledParagraph(
      `Keywords: ${thesis.metadata?.keywords?.join(', ')}`,
      { font: defaultFont, size: defaultFontSize, italic: true },
      AlignmentType.LEFT,
      { before: 720 }
    ),
    new Paragraph({ children: [new PageBreak()] })
  ];
};

const createTableOfContents = () => {
  return [
    createStyledParagraph(
      "TABLE OF CONTENTS",
      { font: defaultFont, size: headingOneSize, bold: true },
      AlignmentType.CENTER,
      { before: 720, after: 480 }
    ),
    new TableOfContents("Summary", {
      hyperlink: true,
      headingStyleRange: "1-5",
      stylesWithLevels: [
        new StyleLevel("Heading1", 1),
        new StyleLevel("Heading2", 2),
        new StyleLevel("Heading3", 3)
      ],
    }),
    new Paragraph({ children: [new PageBreak()] })
  ];
};

const createFigures = (figures: Figure[]) => {
  return figures.flatMap((figure, index) => {
    const paragraphs: Paragraph[] = [];
    
    if (figure.imageUrl) {
      try {
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 240 },
          children: [
            new ImageRun({
              data: Buffer.from(figure.imageUrl.split(',')[1], 'base64'),
              transformation: {
                width: convertInchesToTwip(6),
                height: convertInchesToTwip(4.5),
              },
            }),
          ],
        }));
      } catch (e) {
        console.error(`Error loading image: ${figure.imageUrl}`, e);
        paragraphs.push(createStyledParagraph(
          `[Error loading figure ${figure.number}]`,
          { font: defaultFont, size: defaultFontSize },
          AlignmentType.CENTER
        ));
      }
    }

    paragraphs.push(createStyledParagraph(
      `Figure ${figure.number}. ${figure.caption}`,
      { font: defaultFont, size: defaultFontSize, italic: true },
      AlignmentType.CENTER,
      { before: 240, after: 480 }
    ));

    return paragraphs;
  });
};

const createListOfFigures = (thesis: Thesis) => {
  const figures = thesis.chapters.flatMap(chapter => 
    chapter.sections.flatMap(section => section.figures)
  );
  
  return [
    createStyledParagraph(
      "LIST OF FIGURES",
      { font: defaultFont, size: headingOneSize, bold: true },
      AlignmentType.CENTER,
      { before: 720, after: 480 }
    ),
    ...figures.map(figure => createStyledParagraph(
      `Figure ${figure.number}: ${figure.caption}`,
      { font: defaultFont, size: defaultFontSize },
      AlignmentType.LEFT,
      { line: lineSpacing }
    )),
    new Paragraph({ children: [new PageBreak()] })
  ];
};

const createTables = (tables: Table[]) => {
  return tables.map(table => {
    const headerRow = new TableRow({
      children: table.headers.map(header =>
        new TableCell({
          children: [createStyledParagraph(
            header,
            { font: defaultFont, size: defaultFontSize, bold: true },
            AlignmentType.CENTER
          )],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 2400, type: WidthType.DXA },
          shading: { fill: "EDEDED", color: "auto", type: "solid" }
        })
      )
    });

    const dataRows = table.rows.map(row => new TableRow({
      children: row.map(cell =>
        new TableCell({
          children: [createStyledParagraph(
            cell,
            { font: defaultFont, size: defaultFontSize },
            AlignmentType.LEFT
          )],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 2400, type: WidthType.DXA }
        })
      )
    }));

    return new DocxTable({
      rows: [headerRow, ...dataRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
      properties: {
        style: 'TableGrid',
        layout: "autofit",
        borders: {
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
          insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 }
        }
      } as TableProperties,
      margins: { top: 120, bottom: 120, left: 120, right: 120 }
    });
  });
};

const createListOfTables = (thesis: Thesis) => {
  const tables = thesis.chapters.flatMap(chapter => 
    chapter.sections.flatMap(section => section.tables)
  );

  return [
    createStyledParagraph(
      "LIST OF TABLES",
      { font: defaultFont, size: headingOneSize, bold: true },
      AlignmentType.CENTER,
      { before: 720, after: 480 }
    ),
    ...tables.map((table, index) => createStyledParagraph(
      `Table ${index + 1}: ${table.caption}`,
      { font: defaultFont, size: defaultFontSize },
      AlignmentType.LEFT,
      { line: lineSpacing }
    )),
    new Paragraph({ children: [new PageBreak()] })
  ];
};

// References and Citations
const createCitations = (citations: Citation[]) => {
  return citations.map(citation => createStyledParagraph(
    `(${citation.authors.join(', ')}, ${citation.year}): ${citation.text}, ${citation.source}`,
    { font: defaultFont, size: defaultFontSize },
    AlignmentType.LEFT,
    { line: lineSpacing }
  ));
};

const formatReference = (reference: Reference): string => {
  switch (reference.type) {
    case 'article':
      return `${reference.authors.join(', ')}. (${reference.year}). ${reference.title}. ${reference.journal}, ${reference.volume}(${reference.issue}), ${reference.pages}. ${reference.doi ? `https://doi.org/${reference.doi}` : ""}`;
    case 'book':
      return `${reference.authors.join(', ')}. (${reference.year}). ${reference.title}. ${reference.publisher}. ${reference.doi ? `https://doi.org/${reference.doi}` : ""}`;
    case 'website':
      return `${reference.authors.join(', ')}. (${reference.year}). ${reference.title}. ${reference.url}`;
    default:
      return `${reference.authors.join(', ')}. (${reference.year}). ${reference.title}. ${reference.doi ? `https://doi.org/${reference.doi}` : ""}`;
  }
};

const createReferences = (references: Reference[]) => {
  return [
    createStyledParagraph(
      "REFERENCES",
      { font: defaultFont, size: headingOneSize, bold: true },
      AlignmentType.CENTER,
      { before: 720, after: 480 }
    ),
    ...references.map(reference => createStyledParagraph(
      formatReference(reference),
      { font: defaultFont, size: defaultFontSize },
      AlignmentType.LEFT,
      { before: 240, line: lineSpacing, hanging: 720 }
    ))
  ];
};

// Main content creation
const createSectionContent = (section: Section) => {
  const paragraphs: Paragraph[] = [
    createStyledParagraph(
      section.title,
      { font: defaultFont, size: headingTwoSize, bold: true },
      AlignmentType.LEFT,
      { before: 480, after: 240 }
    )
  ];

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
  const paragraphs: Paragraph[] = [
    createStyledParagraph(
      `CHAPTER ${chapter.number}. ${chapter.title}`,
      { font: defaultFont, size: headingOneSize, bold: true },
      AlignmentType.CENTER,
      { before: 720, after: 480 }
    )
  ];

  chapter.sections.forEach((section) => {
    paragraphs.push(...createSectionContent(section));
  });

  return paragraphs;
};

// Main document generation
export const generateThesisDocx = (thesis: Thesis): Document => {
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: defaultFont,
            size: defaultFontSize,
          },
          paragraph: {
            spacing: { line: lineSpacing, lineRule: LineRuleType.EXACT }
          }
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: defaultFont,
            size: headingOneSize,
            bold: true,
          },
          paragraph: {
            spacing: { before: 480, after: 240 },
            outlineLevel: 0
          }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: defaultFont,
            size: headingTwoSize,
            bold: true,
          },
          paragraph: {
            spacing: { before: 360, after: 240 },
            outlineLevel: 1
          }
        }
      ],
      default: {
        document: {
          run: {
            font: defaultFont,
            size: defaultFontSize,
          }
        }
      }
    },
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.5) // Extra margin for binding
            },
            size: {
              width: convertInchesToTwip(8.5),
              height: convertInchesToTwip(11)
            }
          }
        },
        headers: { default: createHeader(thesis) },
        footers: { default: createFooter() },
        children: [
          ...createTitlePage(thesis),
          ...createCopyrightPage(thesis),
          ...createAbstract(thesis),
          ...createTableOfContents(),
          ...createListOfFigures(thesis),
          ...createListOfTables(thesis),
          ...thesis.chapters.flatMap(chapter => createChapterContentWithSections(chapter)),
          ...createReferences(thesis.backMatter.find(section => 
            section.type === 'references')?.references || []),
          ...thesis.backMatter
            .filter(section => section.type === 'appendix')
            .flatMap(section => createSectionContent(section))
        ]
      }
    ]
  });

  return doc;
};