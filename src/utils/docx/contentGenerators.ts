import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  TableOfContents, 
  StyleLevel,
  convertInchesToTwip,
  ImageRun,
  IImageOptions
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

export const generateContent = async ({ thesis, isPreview = false }: ContentGenerationOptions): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;

  // Front Matter (including General Introduction)
  if (Array.isArray(thesis.frontMatter)) {
    for (const section of thesis.frontMatter) {
      // Special handling for General Introduction
      if (section.type === 'introduction') {
        paragraphs.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
            spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
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
        continue;
      }

      // Handle other front matter sections
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

  // Chapters with figures and tables
  if (Array.isArray(thesis.chapters)) {
    for (const chapter of thesis.chapters) {
      if (chapter.title) {
        paragraphs.push(
          new Paragraph({
            text: chapter.title,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
          })
        );
      }

      if (chapter.content) {
        paragraphs.push(
          new Paragraph({
            text: chapter.content,
            style: 'Normal',
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
          })
        );
      }

      // Add figures
      if (Array.isArray(chapter.figures)) {
        for (const figure of chapter.figures) {
          const figureParagraphs = await generateFigure(figure, figureNumber);
          paragraphs.push(...figureParagraphs);
          figureNumber++;
        }
      }

      // Add tables
      if (Array.isArray(chapter.tables)) {
        chapter.tables.forEach(table => {
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
      if (Array.isArray(chapter.footnotes) && chapter.footnotes.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: 'Footnotes',
            style: 'heading3',
            spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
          })
        );
        chapter.footnotes.forEach(footnote => {
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
  if (Array.isArray(thesis.backMatter)) {
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
  }

  return paragraphs;
};
