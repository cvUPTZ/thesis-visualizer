import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType,
  TableOfContents,
  convertInchesToTwip,
  ImageRun,
  IImageOptions
} from 'docx';
import { ContentGenerationOptions } from './types';
import { defaultStyles, previewStyles } from './styleConfig';
import { convertImageToBase64 } from './imageUtils';

export const generateContent = async ({ thesis, isPreview = false }: ContentGenerationOptions): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;

  // Add General Introduction if it exists
  if (thesis.content?.generalIntroduction) {
    paragraphs.push(
      new Paragraph({
        text: "General Introduction",
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      }),
      new Paragraph({
        text: thesis.content.generalIntroduction,
        style: 'Normal',
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
      })
    );
  }

  // Add List of Figures if there are any
  if (thesis.chapters.some(chapter => chapter.figures?.length > 0)) {
    paragraphs.push(...generateListOfFigures(thesis));
  }

  // Add List of Tables if there are any
  if (thesis.chapters.some(chapter => chapter.tables?.length > 0)) {
    paragraphs.push(...generateListOfTables(thesis));
  }

  // Front Matter
  if (Array.isArray(thesis.frontMatter)) {
    for (const section of thesis.frontMatter) {
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
    }
  }

  // Main Content (Chapters)
  if (Array.isArray(thesis.chapters)) {
    for (const chapter of thesis.chapters) {
      // Add chapter title
      if (chapter.title) {
        paragraphs.push(
          new Paragraph({
            text: chapter.title,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
          })
        );
      }

      // Add chapter content
      if (chapter.content) {
        paragraphs.push(
          new Paragraph({
            text: chapter.content,
            style: 'Normal',
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
          })
        );
      }

      // Add sections
      for (const section of chapter.sections) {
        paragraphs.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_2,
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

        // Add figures
        if (Array.isArray(section.figures)) {
          for (const figure of section.figures) {
            const figureParagraphs = await generateFigure(figure, paragraphs.length + 1);
            paragraphs.push(...figureParagraphs);
          }
        }

        // Add tables
        if (Array.isArray(section.tables)) {
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
      }
    }
  }

  // Back Matter
  if (Array.isArray(thesis.backMatter)) {
    for (const section of thesis.backMatter) {
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
    }
  }

  return paragraphs;
};

export const generateTableOfContents = (): TableOfContents => {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-5",
    stylesWithLevels: [
      {
        level: 1,
        styleName: "heading 1"
      },
      {
        level: 2,
        styleName: "heading 2"
      }
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
  thesis.chapters.forEach((chapter: any) => {
    if (chapter.figures && chapter.figures.length > 0) {
      chapter.figures.forEach((figure: any) => {
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
  thesis.chapters.forEach((chapter: any) => {
    if (chapter.tables && chapter.tables.length > 0) {
      chapter.tables.forEach((table: any) => {
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

  return paragraphs;
};

const generateFigure = async (figure: any, figureNumber: number): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  try {
    if (figure.imageUrl) {
      const base64Image = await convertImageToBase64(figure.imageUrl);
      
      paragraphs.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: base64Image,
              transformation: {
                width: 400,
                height: 300
              },
              type: 'png',
              fallback: {
                type: 'png',
                width: 400,
                height: 300
              }
            } as IImageOptions)
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
    }
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
