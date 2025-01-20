import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  TableOfContents, 
  StyleLevel,
  convertInchesToTwip,
  ImageRun
} from 'docx';
import { ContentGenerationOptions } from './types';
import { defaultStyles, previewStyles } from './styleConfig';
import { convertImageToBase64 } from './imageUtils';

export const generateTableOfContents = (): TableOfContents => {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-5",
    stylesWithLevels: [
      {
        level: 1,
        styleName: "heading 1",
      } as StyleLevel,
      {
        level: 2,
        styleName: "heading 2",
      } as StyleLevel,
    ],
  });
};

const generateHeader = (title: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        size: 20,
        font: "Times New Roman",
      }),
    ],
    alignment: AlignmentType.CENTER,
    style: 'header',
  });
};

const generateFooter = (): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun("Page "),
      new TextRun({
        children: ["PAGE"],
      }),
      new TextRun(" of "),
      new TextRun({
        children: ["NUMPAGES"],
      }),
    ],
    alignment: AlignmentType.CENTER,
    style: 'footer',
  });
};

const generateListOfFigures = (thesis: any): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "List of Figures",
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
    })
  ];

  let figureNumber = 1;
  thesis.chapters.forEach(chapter => {
    chapter.sections.forEach(section => {
      if (section.figures && section.figures.length > 0) {
        section.figures.forEach(figure => {
          paragraphs.push(
            new Paragraph({
              text: `Figure ${figureNumber}: ${figure.caption}`,
              spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
              style: 'listItem'
            })
          );
          figureNumber++;
        });
      }
    });
  });

  return paragraphs;
};

const generateListOfTables = (thesis: any): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "List of Tables",
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
    })
  ];

  let tableNumber = 1;
  thesis.chapters.forEach(chapter => {
    chapter.sections.forEach(section => {
      if (section.tables && section.tables.length > 0) {
        section.tables.forEach(table => {
          paragraphs.push(
            new Paragraph({
              text: `Table ${tableNumber}: ${table.caption || table.title}`,
              spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
              style: 'listItem'
            })
          );
          tableNumber++;
        });
      }
    });
  });

  return paragraphs;
};

const generateFigure = async (figure: any, figureNumber: number): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  try {
    const base64Image = await convertImageToBase64(figure.imageUrl);
    
    paragraphs.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: base64Image,
            transformation: {
              width: 400,
              height: 300
            }
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.25) }
      }),
      new Paragraph({
        text: `Figure ${figureNumber}: ${figure.caption}`,
        alignment: AlignmentType.CENTER,
        style: 'caption',
        spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.5) }
      })
    );
  } catch (error) {
    console.error('Error generating figure:', error);
    paragraphs.push(
      new Paragraph({
        text: `[Figure ${figureNumber}: ${figure.caption}] - Image could not be loaded`,
        alignment: AlignmentType.CENTER,
        style: 'caption'
      })
    );
  }
  return paragraphs;
};

export const generateContent = async ({ thesis, isPreview = false }: ContentGenerationOptions): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;

  // Add List of Figures
  paragraphs.push(...generateListOfFigures(thesis));

  // Add List of Tables
  paragraphs.push(...generateListOfTables(thesis));

  // Front Matter
  thesis.frontMatter.forEach(section => {
    paragraphs.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      })
    );

    if (section.content) {
      paragraphs.push(
        new Paragraph({
          text: section.content,
          style: 'Normal',
          spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
        })
      );
    }
  });

  let figureNumber = 1;
  // Chapters with figures and tables
  for (const chapter of thesis.chapters) {
    paragraphs.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      })
    );

    if (chapter.content) {
      paragraphs.push(
        new Paragraph({
          text: chapter.content,
          style: 'Normal',
          spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
        })
      );
    }

    for (const section of chapter.sections) {
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
          spacing: styles.default.heading2.paragraph.spacing,
        })
      );

      // Add section content
      const contentParagraphs = section.content.split('\n\n');
      contentParagraphs.forEach(content => {
        if (content.trim()) {
          paragraphs.push(
            new Paragraph({
              text: content,
              spacing: styles.default.document.paragraph.spacing,
              style: 'Normal',
            })
          );
        }
      });

      // Add figures
      if (section.figures && section.figures.length > 0) {
        for (const figure of section.figures) {
          const figureParagraphs = await generateFigure(figure, figureNumber);
          paragraphs.push(...figureParagraphs);
          figureNumber++;
        }
      }

      // Add tables
      if (section.tables && section.tables.length > 0) {
        section.tables.forEach(table => {
          paragraphs.push(
            new Paragraph({
              text: table.content,
              spacing: { before: 240, after: 120 },
            }),
            new Paragraph({
              text: table.caption || table.title,
              style: isPreview ? 'preview-caption' : 'caption',
              spacing: { before: 120, after: 240 },
            })
          );
        });
      }

      // Add footnotes
      if (section.footnotes && section.footnotes.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: 'Footnotes',
            style: 'heading3',
            spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
          })
        );
        section.footnotes.forEach(footnote => {
          paragraphs.push(
            new Paragraph({
              text: `${footnote.number}. ${footnote.content}`,
              style: 'footnote',
              spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
            })
          );
        });
      }
    }
  }

  // Back Matter
  thesis.backMatter.forEach(section => {
    paragraphs.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        spacing: styles.default.heading1.paragraph.spacing,
        style: 'heading 1',
      }),
      new Paragraph({
        text: section.content,
        spacing: styles.default.document.paragraph.spacing,
        style: 'Normal',
      })
    );
  });

  return paragraphs;
};
