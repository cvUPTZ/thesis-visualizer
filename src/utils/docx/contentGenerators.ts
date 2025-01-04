import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents } from 'docx';
import { ContentGenerationOptions } from './types';
import { styles, createStyledParagraph } from './styleConfig';

export const generateTableOfContents = (): TableOfContents => {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-5",
    stylesWithLevels: [
      {
        level: 1,
        heading: "heading 1",
      },
      {
        level: 2,
        heading: "heading 2",
      },
    ],
  });
};

export const generateContent = ({ thesis, includeTableOfContents = true }: ContentGenerationOptions): Paragraph[] => {
  const paragraphs: Paragraph[] = [];

  // Front Matter
  thesis.frontMatter.forEach(section => {
    paragraphs.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
      }),
      new Paragraph({
        text: section.content,
        spacing: { before: 120, after: 120 },
      })
    );
  });

  // Chapters
  thesis.chapters.forEach(chapter => {
    paragraphs.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
      })
    );

    chapter.sections.forEach(section => {
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        }),
        new Paragraph({
          text: section.content,
          spacing: { before: 120, after: 120 },
        })
      );
    });
  });

  // Back Matter
  thesis.backMatter.forEach(section => {
    paragraphs.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
      }),
      new Paragraph({
        text: section.content,
        spacing: { before: 120, after: 120 },
      })
    );
  });

  return paragraphs;
};