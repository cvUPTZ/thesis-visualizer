import { Document, Header, Footer, PageBreak, Paragraph, TextRun, AlignmentType, BorderStyle, PageNumber, ISectionPropertiesOptions } from "docx";
import { documentStyles } from './docx/documentStyles';
import { generateTitlePage, generateAbstractSection, generateChapterContent, generateTableOfContents } from './docx/sectionGenerators';
import { Thesis } from '@/types/thesis';

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

  const tocSections = [
    ...thesis.frontMatter.map(section => ({
      title: section.title,
      page: 0
    })),
    ...thesis.chapters.map((chapter, index) => ({
      title: `Chapter ${index + 1}: ${chapter.title}`,
      page: 0
    }))
  ];

  const preliminaryPageSettings: ISectionPropertiesOptions = {
    properties: {
      page: {
        size: {
          width: 12240, // 8.5"
          height: 15840, // 11"
        },
        margin: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1800
        }
      },
      pageNumberStart: 1,
      pageNumberFormatType: 'lowerRoman'
    }
  };

  const mainPageSettings: ISectionPropertiesOptions = {
    properties: {
      page: {
        size: {
          width: 12240, // 8.5"
          height: 15840, // 11"
        },
        margin: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1800
        }
      },
      pageNumberStart: 1,
      pageNumberFormatType: 'decimal'
    }
  };

  const doc = new Document({
    styles: documentStyles,
    sections: [
      {
        properties: preliminaryPageSettings.properties,
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
      {
        properties: mainPageSettings.properties,
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