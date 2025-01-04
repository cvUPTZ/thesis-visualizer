import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  TableOfContents,
  ImageRun,
  AlignmentType,
  convertInchesToTwip,
  LevelFormat,
  PageNumber,
  Footer,
  Header,
  PageBreak,
  NumberFormat,
} from 'docx';
import { Chapter, Section, Figure, Citation, Table as ThesisTable } from '@/types/thesis';

const PAGE_WIDTH = convertInchesToTwip(8.5);
const PAGE_MARGINS = {
  top: convertInchesToTwip(1),
  right: convertInchesToTwip(1),
  bottom: convertInchesToTwip(1),
  left: convertInchesToTwip(1),
};

const generateFigures = async (figures: Figure[]) => {
  return Promise.all(figures.map(async (figure) => {
    try {
      // Convert base64 to Uint8Array
      const base64Data = figure.imageUrl.split(',')[1];
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      return new Paragraph({
        children: [
          new ImageRun({
            data: bytes,
            transformation: {
              width: figure.dimensions?.width || 400,
              height: figure.dimensions?.height || 300,
            },
            altText: {
              title: figure.caption || 'Figure',
              description: figure.altText || figure.caption || 'Figure image',
            },
          }),
          new TextRun({
            text: `\nFigure ${figure.number}: ${figure.caption}`,
            break: 1,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 240,
          after: 240,
        },
      });
    } catch (error) {
      console.error('Error generating figure:', error);
      return new Paragraph({
        text: `[Error loading figure: ${figure.caption || 'Untitled'}]`,
        alignment: AlignmentType.CENTER,
      });
    }
  }));
};

export const generateThesisDocx = async (thesis: {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  metadata?: {
    universityName?: string;
    departmentName?: string;
    authorName?: string;
    thesisDate?: string;
    committeeMembers?: string[];
  };
}) => {
  console.log('Generating DOCX with thesis data:', thesis);

  const sections = [];

  // Title Page
  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
        size: {
          width: PAGE_WIDTH,
          height: convertInchesToTwip(11),
        },
      },
    },
    children: generateTitlePage(thesis.metadata),
  });

  // Front Matter
  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
      },
    },
    children: [
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-5",
        stylesWithLevels: [
          { level: 1, style: "Heading1" },
          { level: 2, style: "Heading2" },
        ],
      }),
      ...await generateSectionContent(thesis.frontMatter),
    ],
  });

  // Main Content
  const mainContent = [
    ...await generateChapterContent(thesis.chapters),
    ...await generateSectionContent(thesis.backMatter),
  ];

  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
      },
    },
    children: mainContent,
  });

  const doc = new Document({
    sections,
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24,
            font: "Times New Roman",
          },
          paragraph: {
            spacing: {
              line: 360,
              before: 240,
              after: 240,
            },
          },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 32,
            bold: true,
            font: "Times New Roman",
          },
          paragraph: {
            spacing: {
              before: 480,
              after: 240,
            },
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 28,
            bold: true,
            font: "Times New Roman",
          },
          paragraph: {
            spacing: {
              before: 360,
              after: 240,
            },
          },
        },
      ],
    },
  });

  return doc;
};

const generateSectionContent = async (sections: Section[]) => {
  const content: Paragraph[] = [];
  
  for (const section of sections) {
    content.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      }),
      new Paragraph({
        children: [new TextRun(section.content)],
      })
    );

    // Add figures
    if (section.figures?.length) {
      const figureContent = await generateFigures(section.figures);
      content.push(...figureContent);
    }

    // Add tables
    if (section.tables?.length) {
      section.tables.forEach(table => {
        const tableContent = generateTable(table);
        if (tableContent) {
          content.push(
            new Paragraph({
              text: tableContent,
              spacing: {
                before: 240,
                after: 0,
              },
            })
          );
          if (table.caption) {
            content.push(
              new Paragraph({
                text: `Table ${table.id}: ${table.caption}`,
                alignment: AlignmentType.CENTER,
                spacing: {
                  before: 240,
                  after: 240,
                },
              })
            );
          }
        }
      });
    }

    // Add citations
    if (section.citations?.length) {
      content.push(...generateCitations(section.citations));
    }
  }

  return content;
};

const generateChapterContent = async (chapters: Chapter[]) => {
  const content: Paragraph[] = [];

  for (const chapter of chapters) {
    content.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      })
    );

    for (const section of chapter.sections) {
      content.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [new TextRun(section.content)],
        })
      );

      // Add figures
      if (section.figures?.length) {
        const figureContent = await generateFigures(section.figures);
        content.push(...figureContent);
      }

      // Add tables
      if (section.tables?.length) {
        section.tables.forEach(table => {
          const tableContent = generateTable(table);
          content.push(
            new Paragraph({
              text: tableContent || '',
              spacing: {
                before: 240,
                after: 0,
              },
            })
          );
          if (table.caption) {
            content.push(
              new Paragraph({
                text: `Table ${table.id}: ${table.caption}`,
                alignment: AlignmentType.CENTER,
                spacing: {
                  before: 240,
                  after: 240,
                },
              })
            );
          }
        });
      }

      // Add citations
      if (section.citations?.length) {
        content.push(...generateCitations(section.citations));
      }
    }
  }

  return content;
};

const generateTitlePage = (metadata?: {
  universityName?: string;
  departmentName?: string;
  authorName?: string;
  thesisDate?: string;
  committeeMembers?: string[];
}) => {
  const children = [
    new Paragraph({
      text: metadata?.universityName || "University Name",
      alignment: AlignmentType.CENTER,
      spacing: {
        before: convertInchesToTwip(2),
        after: convertInchesToTwip(0.5),
      },
      style: "Heading1",
    }),
    new Paragraph({
      text: metadata?.departmentName || "Department Name",
      alignment: AlignmentType.CENTER,
      spacing: {
        after: convertInchesToTwip(2),
      },
      style: "Normal",
    }),
    new Paragraph({
      text: "A Thesis Submitted in Partial Fulfillment",
      alignment: AlignmentType.CENTER,
      style: "Normal",
    }),
    new Paragraph({
      text: "of the Requirements for the Degree of",
      alignment: AlignmentType.CENTER,
      style: "Normal",
    }),
    new Paragraph({
      text: "Doctor of Philosophy",
      alignment: AlignmentType.CENTER,
      spacing: {
        after: convertInchesToTwip(2),
      },
      style: "Normal",
    }),
    new Paragraph({
      text: "by",
      alignment: AlignmentType.CENTER,
      style: "Normal",
    }),
    new Paragraph({
      text: metadata?.authorName || "Author Name",
      alignment: AlignmentType.CENTER,
      spacing: {
        after: convertInchesToTwip(2),
      },
      style: "Normal",
    }),
    new Paragraph({
      text: metadata?.thesisDate || "Month Year",
      alignment: AlignmentType.CENTER,
      style: "Normal",
    }),
  ];

  if (metadata?.committeeMembers?.length) {
    children.push(
      new Paragraph({
        text: "Thesis Committee:",
        alignment: AlignmentType.CENTER,
        spacing: {
          before: convertInchesToTwip(1),
        },
        style: "Normal",
      }),
      ...metadata.committeeMembers.map(
        (member) =>
          new Paragraph({
            text: member,
            alignment: AlignmentType.CENTER,
            style: "Normal",
          })
      )
    );
  }

  return children;
};

const generateTable = (table: ThesisTable): string | null => {
  try {
    // Parse the HTML content to create docx table
    const parser = new DOMParser();
    const doc = parser.parseFromString(table.content, 'text/html');
    const htmlTable = doc.querySelector('table');
    
    if (!htmlTable) {
      console.warn('Invalid table content:', table);
      return null;
    }

    // Convert table to string representation
    return htmlTable.textContent || null;
  } catch (error) {
    console.error('Error generating table:', error);
    return null;
  }
};

const generateCitations = (citations: Citation[]) => {
  return citations.map((citation) => {
    let citationText = `${citation.authors.join(', ')} (${citation.year}). ${citation.text}`;
    if (citation.journal) citationText += ` ${citation.journal}.`;
    if (citation.doi) citationText += ` DOI: ${citation.doi}`;

    return new Paragraph({
      text: citationText,
      style: "Normal",
      spacing: {
        before: 240,
        after: 240,
      },
    });
  });
};
