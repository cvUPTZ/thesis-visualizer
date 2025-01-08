import { Document, Header, Footer } from 'docx';
import { Thesis } from '@/types/thesis';
import { generateTitlePage } from './docx/titlePageGenerator';
import { generateContent, generateTableOfContents } from './docx/contentGenerators';
import { documentStyles, pageSettings } from './docx/documentStyles';
import { createPageNumberParagraph } from './docx/pageNumbering';

export const generateThesisDocx = async (thesis: Thesis) => {
  console.log('Generating academic DOCX with thesis data:', thesis);

  const sections = [];

  // Title Page
  sections.push({
    properties: {
      page: {
        margin: pageSettings.margins,
        size: {
          width: pageSettings.width,
          height: pageSettings.height,
        },
      },
    },
    children: generateTitlePage({ thesis }),
  });

  // Table of Contents and Content sections
  [
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
      content: generateContent({ thesis, isPreview: false }),
    },
  ].forEach(section => {
    sections.push({
      properties: {
        page: {
          margin: pageSettings.margins,
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
  });

  const doc = new Document({
    sections,
    styles: documentStyles,
  });

  return doc;
};