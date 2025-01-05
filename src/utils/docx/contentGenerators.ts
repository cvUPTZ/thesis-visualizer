import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents, StyleLevel, convertInchesToTwip, Header, Footer } from 'docx';
import { ContentGenerationOptions } from './types';
import { defaultStyles, previewStyles } from './styleConfig';

const PAGE_WIDTH = convertInchesToTwip(8.5);
const PAGE_MARGINS = {
  top: convertInchesToTwip(1),
  right: convertInchesToTwip(1),
  bottom: convertInchesToTwip(1),
  left: convertInchesToTwip(1.5), // Wider left margin for binding
};

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

export const generateContent = ({ thesis, isPreview = false }: ContentGenerationOptions & { isPreview?: boolean }): Paragraph[] => {
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;

  // Add header
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: thesis.metadata?.title || "Thesis Title",
          size: 20,
        }),
      ],
      style: 'header',
    })
  );

  // Front Matter with proper spacing and styling
  thesis.frontMatter.forEach(section => {
    if (section.type !== 'title') {
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          style: 'heading 1',
        }),
        new Paragraph({
          text: section.content,
          spacing: styles.default.document.paragraph.spacing,
          style: 'Normal',
        })
      );
    }
  });

  // Chapters with proper formatting
  thesis.chapters.forEach(chapter => {
    paragraphs.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        spacing: styles.default.heading1.paragraph.spacing,
        style: 'heading 1',
      })
    );

    chapter.sections.forEach(section => {
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
          spacing: styles.default.heading2.paragraph.spacing,
          style: 'heading 2',
        })
      );

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

      // Handle figures with captions
      if (section.figures && section.figures.length > 0) {
        section.figures.forEach(figure => {
          paragraphs.push(
            new Paragraph({
              text: `[Figure ${figure.number}]`,
              spacing: { before: 240, after: 120 },
              alignment: 'center',
            }),
            new Paragraph({
              text: figure.caption,
              style: isPreview ? 'preview-caption' : 'caption',
              spacing: { before: 120, after: 240 },
            })
          );
        });
      }

      // Handle tables with captions
      if (section.tables && section.tables.length > 0) {
        section.tables.forEach(table => {
          paragraphs.push(
            new Paragraph({
              text: table.content,
              spacing: { before: 240, after: 120 },
            }),
            new Paragraph({
              text: `Table ${table.id}: ${table.caption}`,
              style: isPreview ? 'preview-caption' : 'caption',
              spacing: { before: 120, after: 240 },
            })
          );
        });
      }
    });
  });

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

  // Add footer with page number
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          children: [
            TextRun.pageNumber(),
            new TextRun(" of "),
            TextRun.numberOfTotalPages(),
          ],
        }),
      ],
      style: 'footer',
      alignment: 'center',
    })
  );

  return paragraphs;
};
