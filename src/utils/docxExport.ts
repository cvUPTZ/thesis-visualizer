import { Document, Paragraph, TextRun, HeadingLevel, TableOfContents, Packer } from "npm:docx";
import { Chapter, Section } from '@/types/thesis';

const generateThesisDocx = (thesis: {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  metadata?: {
    universityName?: string;
    departmentName?: string;
    authorName?: string;
    thesisDate?: string;
    committeeMembers?: string[];
  };
}) => {
  console.log('Generating document structure...');

  const titlePage = thesis.frontMatter.find(section => section.type === 'title');
  const abstractPage = thesis.frontMatter.find(section => section.type === 'abstract');

  const children = [];

  // Add title page if available
  if (titlePage) {
    children.push(
      new Paragraph({
        text: titlePage.title,
        heading: HeadingLevel.TITLE,
        spacing: { before: 3000, after: 400 },
      }),
    );

    // Add metadata if available
    if (thesis.metadata) {
      if (thesis.metadata.universityName) {
        children.push(new Paragraph({
          text: thesis.metadata.universityName,
          spacing: { before: 400, after: 200 },
        }));
      }
      if (thesis.metadata.departmentName) {
        children.push(new Paragraph({
          text: thesis.metadata.departmentName,
          spacing: { before: 200, after: 400 },
        }));
      }
      if (thesis.metadata.authorName) {
        children.push(new Paragraph({
          text: `By ${thesis.metadata.authorName}`,
          spacing: { before: 400, after: 200 },
        }));
      }
      if (thesis.metadata.thesisDate) {
        children.push(new Paragraph({
          text: thesis.metadata.thesisDate,
          spacing: { before: 200, after: 400 },
        }));
      }
    }
  }

  // Add table of contents
  children.push(new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-5",
  }));

  // Add abstract if available
  if (abstractPage) {
    children.push(
      new Paragraph({
        text: "Abstract",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [new TextRun(abstractPage.content)],
        spacing: { before: 200, after: 400 },
      })
    );
  }

  // Add chapters
  thesis.chapters.forEach((chapter) => {
    children.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    chapter.sections.forEach((section) => {
      children.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun(section.content)],
          spacing: { before: 100, after: 200 },
        })
      );
    });
  });

  // Add back matter
  thesis.backMatter.forEach((section) => {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [new TextRun(section.content)],
        spacing: { before: 200, after: 400 },
      })
    );
  });

  console.log('Document structure generated');
  
  return new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });
};