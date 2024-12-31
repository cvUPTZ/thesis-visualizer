import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents, ITableOfContentsOptions } from 'docx';
import { Chapter, Section, ThesisSectionType } from '@/types/thesis';

export const generateTableOfContents = (doc: Document) => {
  const tocOptions: ITableOfContentsOptions = {
    headingStyleRange: '1-5',
    stylesWithLevels: [
      { level: 1, styleId: 'Heading1' },
      { level: 2, styleId: 'Heading2' },
      { level: 3, styleId: 'Heading3' },
      { level: 4, styleId: 'Heading4' },
      { level: 5, styleId: 'Heading5' },
    ],
    hyperlink: true,
    headingStyles: [
      HeadingLevel.HEADING_1,
      HeadingLevel.HEADING_2,
      HeadingLevel.HEADING_3,
      HeadingLevel.HEADING_4,
      HeadingLevel.HEADING_5,
    ],
  };
  
  doc.addTableOfContents(new TableOfContents(tocOptions));
};

export const generateDocxContent = (
  frontMatter: Section[],
  chapters: Chapter[],
  backMatter: Section[]
) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...generateSectionContent(frontMatter),
          ...generateChapterContent(chapters),
          ...generateSectionContent(backMatter),
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

export const exportToDocx = async (
  frontMatter: Section[],
  chapters: Chapter[],
  backMatter: Section[]
) => {
  const doc = generateDocxContent(frontMatter, chapters, backMatter);
  generateTableOfContents(doc);

  const buffer = await doc.save();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'thesis.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};