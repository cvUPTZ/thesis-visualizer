import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents, StyleLevel } from 'docx';
import { Chapter, Section } from '@/types/thesis';

const generateTableOfContents = () => {
  return new TableOfContents({
    headingStyleRange: '1-5',
    stylesWithLevels: [
      { level: 1, style: 'Heading1' },
      { level: 2, style: 'Heading2' },
      { level: 3, style: 'Heading3' },
      { level: 4, style: 'Heading4' },
      { level: 5, style: 'Heading5' },
    ] as StyleLevel[],
    hyperlink: true,
    headingStyles: [
      HeadingLevel.HEADING_1,
      HeadingLevel.HEADING_2,
      HeadingLevel.HEADING_3,
      HeadingLevel.HEADING_4,
      HeadingLevel.HEADING_5,
    ],
  });
};

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
          generateTableOfContents(),
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