import { Document, Paragraph, TextRun, TableOfContents, HeadingLevel, ImageRun } from 'docx';
import { Chapter, Section } from '@/types/thesis';

export const generateTableOfContents = () => {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-3",
    stylesWithLevels: [
      {
        level: 0,
        style: "heading 1"
      },
      {
        level: 1,
        style: "heading 2"
      },
      {
        level: 2,
        style: "heading 3"
      }
    ],
  });
};

export const generateContent = async (
  sections: Section[],
  chapters: Chapter[],
  language: string = 'en'
) => {
  const content: Paragraph[] = [];

  // Example content generation logic
  sections.forEach(section => {
    const paragraph = new Paragraph({
      children: [
        new TextRun({
          text: section.title,
          bold: true,
          size: 24,
        }),
        new TextRun({
          text: section.content,
          break: 1,
        }),
      ],
    });
    content.push(paragraph);
  });

  chapters.forEach(chapter => {
    const chapterParagraph = new Paragraph({
      children: [
        new TextRun({
          text: chapter.title,
          bold: true,
          size: 22,
        }),
        new TextRun({
          text: chapter.content,
          break: 1,
        }),
      ],
    });
    content.push(chapterParagraph);
  });

  return content;
};
