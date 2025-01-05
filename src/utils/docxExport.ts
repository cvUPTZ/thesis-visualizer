import { 
  Document, 
  TableOfContents,
  convertInchesToTwip,
  StyleLevel,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
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
  left: convertInchesToTwip(1.5), // Wider left margin for binding
};

export const generateThesisDocx = async (thesis: Thesis) => {
  console.log('Generating academic DOCX with thesis data:', thesis);

  const sections = [];

  // Title Page
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
    children: generateTitlePage({ thesis }),
  });

  // Table of Contents
  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
      },
    },
    children: [
      new Paragraph({
        text: "Table of Contents",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 240 },
      }),
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-5",
        stylesWithLevels: [
          {
            level: 1,
            styleName: "heading 1",
          } as StyleLevel,
          {
            level: 2,
            styleName: "heading 2",
          } as StyleLevel,
        ],
      }),
    ],
  });

  // Content
  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
      },
    },
    children: generateContent({ thesis }),
  });

  const doc = new Document({
    sections,
    styles: defaultStyles,
  });

  return doc;
};

export const generatePreviewDocx = async (thesis: Thesis) => {
  console.log('Generating preview-style DOCX with thesis data:', thesis);

  const sections = [];

  // Title Page (using preview styling)
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
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 240 },
      }),
      // Add other title page elements with preview styling
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
    children: [
      new Paragraph({
        text: "Table of Contents",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 240 },
      }),
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-5",
        stylesWithLevels: [
          {
            level: 1,
            styleName: "heading 1",
          } as StyleLevel,
          {
            level: 2,
            styleName: "heading 2",
          } as StyleLevel,
        ],
      }),
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
    children: generateContent({ thesis, usePreviewStyle: true }),
  });

  const doc = new Document({
    sections,
    styles: previewStyles,
  });

  return doc;
};