import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents, StyleLevel, convertInchesToTwip } from 'docx';
import { ContentGenerationOptions } from './types';
import { styles, createStyledParagraph } from './styleConfig';

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

export const generateContent = ({ thesis, includeTableOfContents = true }: ContentGenerationOptions): Paragraph[] => {
  const paragraphs: Paragraph[] = [];

  // Front Matter with proper spacing and styling
  thesis.frontMatter.forEach(section => {
    if (section.type !== 'title') { // Title is handled separately in title page
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { before: 480, after: 240 },
        }),
        new Paragraph({
          text: section.content,
          spacing: { before: 240, after: 240 },
          style: 'Normal',
        })
      );
    }
  });

  // Chapters with proper academic formatting
  thesis.chapters.forEach(chapter => {
    // Chapter title with page break
    paragraphs.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        spacing: { before: 480, after: 240 },
      })
    );

    // Chapter sections
    chapter.sections.forEach(section => {
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 360, after: 240 },
        })
      );

      // Split content into paragraphs and apply academic formatting
      const contentParagraphs = section.content.split('\n\n');
      contentParagraphs.forEach(content => {
        if (content.trim()) {
          paragraphs.push(
            new Paragraph({
              text: content,
              spacing: { before: 240, after: 240 },
              style: 'Normal',
            })
          );
        }
      });

      // Handle figures with captions
      if (section.figures && section.figures.length > 0) {
        section.figures.forEach(figure => {
          // Figure placeholder (actual image handling would need additional setup)
          paragraphs.push(
            new Paragraph({
              text: `[Figure ${figure.number}]`,
              spacing: { before: 240, after: 120 },
              alignment: 'center',
            }),
            new Paragraph({
              text: figure.caption,
              style: 'caption',
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
              style: 'caption',
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
        spacing: { before: 480, after: 240 },
      }),
      new Paragraph({
        text: section.content,
        spacing: { before: 240, after: 240 },
        style: 'Normal',
      })
    );
  });

  return paragraphs;
};