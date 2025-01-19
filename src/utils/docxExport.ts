import { 
  Document, 
  TableOfContents,
  convertInchesToTwip,
  StyleLevel,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Header,
  Footer,
} from 'docx';
import { Thesis } from '@/types/thesis';
import { generateTitlePage } from './docx/titlePageGenerator';
import { generateContent, generateTableOfContents } from './docx/contentGenerators';
import { defaultStyles, previewStyles } from './docx/styleConfig';

const PAGE_WIDTH = convertInchesToTwip(8.5);
const PAGE_MARGINS = {
  top: convertInchesToTwip(1),
  right: convertInchesToTwip(1),
  bottom: convertInchesToTwip(1),
  left: convertInchesToTwip(1.5),
};

const createPageNumberParagraph = (): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun("Page "),
      new TextRun({
        children: ["PAGE"],
      }),
      new TextRun(" of "),
      new TextRun({
        children: ["NUMPAGES"],
      }),
    ],
    alignment: AlignmentType.CENTER,
  });
};

export const generateThesisDocx = async (thesis: Thesis) => {
  console.log('Generating academic DOCX with thesis data:', thesis);

  const sections = [];

  // Title Page
  const titlePageSection = {
    properties: {
      page: {
        margin: PAGE_MARGINS,
        size: {
          width: PAGE_WIDTH,
          height: convertInchesToTwip(11),
        },
      },
    },
    children: generateTitlePage({ thesis }) || [],
  };
  sections.push(titlePageSection);

  // Table of Contents and Content sections
  const contentSections = [
    {
      title: "Table of Contents",
      content: [
        new Paragraph({
          text: "Table of Contents",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 240 },
        }),
        generateTableOfContents(),
      ],
    },
    {
      title: thesis.frontMatter?.[0]?.title || "Untitled Thesis",
      content: await generateContent({ thesis, isPreview: false }) || [],
    },
  ];

  contentSections.forEach(section => {
    if (Array.isArray(section.content)) {
      sections.push({
        properties: {
          page: {
            margin: PAGE_MARGINS,
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                text: section.title,
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [createPageNumberParagraph()],
          }),
        },
        children: section.content,
      });
    }
  });

  console.log('Creating document with sections:', sections);

  const doc = new Document({
    sections: sections.filter(section => 
      section && section.children && Array.isArray(section.children)
    ),
    styles: defaultStyles,
  });

  return doc;
};

export const generatePreviewDocx = async (thesis: Thesis) => {
  console.log('Generating preview-style DOCX with thesis data:', thesis);

  const sections = [];

  // Title Page with preview styling
  sections.push({
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1),
        },
      },
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: thesis.frontMatter[0]?.title || "Untitled Thesis",
            size: 36,
            bold: true,
            font: 'Arial',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 240 },
      }),
      // Add preview-styled metadata
      ...Object.entries(thesis.metadata || {}).map(([key, value]) => 
        new Paragraph({
          text: `${key}: ${value}`,
          spacing: { before: 120, after: 120 },
          alignment: AlignmentType.CENTER,
          style: 'Normal',
        })
      ),
    ],
  });

  // Table of Contents with preview styling
  sections.push({
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1),
        },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            text: thesis.frontMatter[0]?.title || "Untitled Thesis",
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          createPageNumberParagraph(),
        ],
      }),
    },
    children: [
      new Paragraph({
        text: "Table of Contents",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 240 },
      }),
      generateTableOfContents(),
    ],
  });

  // Content with preview styling
  sections.push({
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1),
        },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            text: thesis.frontMatter[0]?.title || "Untitled Thesis",
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          createPageNumberParagraph(),
        ],
      }),
    },
    children: await generateContent({ thesis, isPreview: true }),
  });

  const doc = new Document({
    sections,
    styles: previewStyles,
  });

  return doc;
};
