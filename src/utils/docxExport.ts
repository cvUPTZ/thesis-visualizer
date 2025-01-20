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

  // Ensure thesis data is properly structured
  if (!thesis || !Array.isArray(thesis.frontMatter)) {
    console.error('Invalid thesis data structure:', thesis);
    throw new Error('Invalid thesis data structure');
  }

  const sections = [];

  // Title Page
  const titlePageChildren = generateTitlePage({ thesis });
  if (!Array.isArray(titlePageChildren)) {
    console.error('Title page children is not an array:', titlePageChildren);
    throw new Error('Failed to generate title page');
  }

  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
        size: {
          width: PAGE_WIDTH,
          height: convertInchesToTwip(11),
        },
      },
    },
    children: titlePageChildren,
  });

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
      title: thesis.frontMatter[0]?.title || "Untitled Thesis",
      content: await generateContent({ thesis, isPreview: false }),
    },
  ];

  for (const section of contentSections) {
    if (!Array.isArray(section.content)) {
      console.error('Section content is not an array:', section);
      continue;
    }

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

  const doc = new Document({
    sections,
    styles: defaultStyles,
  });

  return doc;
};

export const generatePreviewDocx = async (thesis: Thesis) => {
  console.log('Generating preview-style DOCX with thesis data:', thesis);

  if (!thesis || !Array.isArray(thesis.frontMatter)) {
    console.error('Invalid thesis data structure:', thesis);
    throw new Error('Invalid thesis data structure');
  }

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
      ...(thesis.metadata ? Object.entries(thesis.metadata).map(([key, value]) => 
        new Paragraph({
          text: `${key}: ${value}`,
          spacing: { before: 120, after: 120 },
          alignment: AlignmentType.CENTER,
          style: 'Normal',
        })
      ) : []),
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
        children: [createPageNumberParagraph()],
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
  const contentChildren = await generateContent({ thesis, isPreview: true });
  if (!Array.isArray(contentChildren)) {
    console.error('Content children is not an array:', contentChildren);
    throw new Error('Failed to generate content');
  }

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
        children: [createPageNumberParagraph()],
      }),
    },
    children: contentChildren,
  });

  const doc = new Document({
    sections,
    styles: previewStyles,
  });

  return doc;
};