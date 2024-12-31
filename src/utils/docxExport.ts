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
          new TableOfContents("Table of Contents", {
            hyperlink: true,
            headingStyleRange: "1-5",
            stylesWithLevels: [
              { level: 1, styleId: "Heading1" },
              { level: 2, styleId: "Heading2" },
              { level: 3, styleId: "Heading3" },
              { level: 4, styleId: "Heading4" },
              { level: 5, styleId: "Heading5" },
            ],
          }),
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