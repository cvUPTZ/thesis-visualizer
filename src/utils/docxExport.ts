import { Document, Header, Footer, PageBreak, Paragraph, TextRun, AlignmentType, BorderStyle, PageNumber } from "docx";
import { documentStyles, pageSettings, preliminaryPageSettings } from './docx/documentStyles';
import { generateTitlePage, generateAbstractSection, generateChapterContent } from './docx/sectionGenerators';
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

  const doc = new Document({
    styles: documentStyles,
    sections: [
      {
        properties: {
          page: preliminaryPageSettings
        },
        headers: {
          default: createHeader(thesis)
        },
        footers: {
          default: createFooter()
        },
        children: [
          ...generateTitlePage({
            title: titleSection?.title || thesis.title,
            author: thesis.metadata?.authorName || '',
            date: thesis.metadata?.thesisDate || new Date().getFullYear().toString(),
            university: thesis.metadata?.universityName,
            department: thesis.metadata?.departmentName,
            degree: thesis.metadata?.degree
          }),
          ...(abstractSection ? generateAbstractSection(abstractSection.content) : []),
        ]
      },
      {
        properties: {
          page: pageSettings
        },
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

export const generatePreviewDocx = (thesis: Thesis) => {
  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  const abstractSection = thesis.frontMatter.find(section => section.type === 'abstract');

  const doc = new Document({
    styles: documentStyles,
    sections: [
      {
        properties: {
          page: pageSettings
        },
        children: [
          ...generateTitlePage({
            title: titleSection?.title || thesis.title,
            author: thesis.metadata?.authorName || '',
            date: thesis.metadata?.thesisDate || new Date().getFullYear().toString(),
            university: thesis.metadata?.universityName,
            department: thesis.metadata?.departmentName,
            degree: thesis.metadata?.degree
          }),
          ...(abstractSection ? generateAbstractSection(abstractSection.content) : []),
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