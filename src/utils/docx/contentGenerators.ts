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
  console.log('Generating content with thesis:', thesis);
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;

  // Front Matter
  if (Array.isArray(thesis.frontMatter)) {
    for (const section of thesis.frontMatter) {
      console.log('Processing front matter section:', section.title);
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
      console.log('Processing chapter:', chapter.title);
      // Add chapter title
      paragraphs.push(
        new Paragraph({
          text: chapter.title,
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
        })
      );

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

      // Process sections within the chapter
      for (const section of chapter.sections) {
        console.log('Processing section:', section.title);
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

        // Add citations
        if (Array.isArray(section.citations)) {
          section.citations.forEach(citation => {
            paragraphs.push(
              new Paragraph({
                text: citation.text,
                style: 'citation',
                spacing: { before: 120, after: 120 },
              })
            );
          });
        }

        // Add footnotes
        if (Array.isArray(section.footnotes)) {
          section.footnotes.forEach(footnote => {
            paragraphs.push(
              new Paragraph({
                text: footnote.content,
                style: 'footnote',
                spacing: { before: 120, after: 120 },
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
      console.log('Processing back matter section:', section.title);
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