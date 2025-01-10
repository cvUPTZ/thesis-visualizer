import { Document, Header, Footer, PageBreak, Paragraph, TextRun, AlignmentType, BorderStyle, PageNumber } from "docx";
import { documentStyles, pageSettings, preliminaryPageSettings, mainPageSettings } from './docx/documentStyles';
import { generateTitlePage, generateAbstractSection, generateChapterContent, generateTableOfContents } from './docx/sectionGenerators';
import { Thesis } from '@/types/thesis';
import { MarkdownToDocx } from './markdownToDocx';

const createHeader = (thesis: Thesis) => {
  return new Header({
    children: [
      new Paragraph({
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: thesis.metadata?.shortTitle || "Running head",
            font: "Times New Roman",
            size: 24
          }),
          new TextRun({ text: "\t" }),
          new TextRun({
            text: String(PageNumber.CURRENT),
            font: "Times New Roman",
            size: 24
          })
        ],
      }),
    ],
  });
};

const createFooter = () => {
  return new Footer({
    children: [
      new Paragraph({
        border: {
          top: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { before: 200 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: String(PageNumber.CURRENT),
            font: "Times New Roman",
            size: 24
          })
        ],
      }),
    ],
  });
};

export const generateThesisDocx = (thesis: Thesis) => {
  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  const abstractSection = thesis.frontMatter.find(section => section.type === 'abstract');

  // Generate table of contents data
  const tocSections = [
    ...thesis.frontMatter.map(section => ({
      title: section.title,
      page: 0 // Page numbers will be auto-generated
    })),
    ...thesis.chapters.map((chapter, index) => ({
      title: `Chapter ${index + 1}: ${chapter.title}`,
      page: 0
    }))
  ];

  const doc = new Document({
    styles: documentStyles,
    sections: [
      // Preliminary pages (Roman numerals)
      {
        properties: preliminaryPageSettings,
        children: [
          ...generateTitlePage({
            title: titleSection?.title || thesis.title,
            author: thesis.metadata?.authorName || '',
            date: thesis.metadata?.thesisDate || new Date().getFullYear().toString(),
            university: thesis.metadata?.universityName,
            department: thesis.metadata?.departmentName,
            degree: thesis.metadata?.degree
          }),
          ...generateTableOfContents(tocSections),
          ...(abstractSection ? generateAbstractSection(abstractSection.content) : []),
        ]
      },
      // Main content (Arabic numerals)
      {
        properties: mainPageSettings,
        children: [
          ...thesis.chapters.flatMap((chapter, index) => 
            generateChapterContent(
              index + 1,
              chapter.title,
              chapter.content || ''
            )
          )
        ]
      }
    ]
  });

  return doc;
};