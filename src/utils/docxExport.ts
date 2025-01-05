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
      generateTableOfContents(),
    ],
  });

  // Content
  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
      },
    },
    children: generateContent({ thesis, isPreview: false }),
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
    children: generateContent({ thesis, isPreview: true }),
  });

  const doc = new Document({
    sections,
    styles: previewStyles,
  });

  return doc;
};