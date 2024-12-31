import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents } from 'docx';
import { Chapter, Section } from '@/types/thesis';

export const generateThesisDocx = (thesis: {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
}) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new TableOfContents("Table of Contents"),
          ...generateSectionContent(thesis.frontMatter),
          ...generateChapterContent(thesis.chapters),
          ...generateSectionContent(thesis.backMatter),
        ],
      },
    ],
  });

  return doc;
};

const generateSectionContent = (sections: Section[]) => {
  return sections.flatMap((section) => [
    new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [new TextRun(section.content)],
    }),
  ]);
};

const generateChapterContent = (chapters: Chapter[]) => {
  return chapters.flatMap((chapter) => [
    new Paragraph({
      text: chapter.title,
      heading: HeadingLevel.HEADING_1,
    }),
    ...chapter.sections.flatMap((section) => [
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [new TextRun(section.content)],
      }),
    ]),
  ]);
};