import { 
  Document, 
  TableOfContents,
  convertInchesToTwip,
  StyleLevel,
} from 'docx';
import { Thesis } from '@/types/thesis';
import { generateTitlePage } from './docx/titlePageGenerator';
import { generateContent, generateTableOfContents } from './docx/contentGenerators';
import { defaultStyles } from './docx/styleConfig';

const PAGE_WIDTH = convertInchesToTwip(8.5);
const PAGE_MARGINS = {
  top: convertInchesToTwip(1),
  right: convertInchesToTwip(1),
  bottom: convertInchesToTwip(1),
  left: convertInchesToTwip(1),
};

export const generateThesisDocx = async (thesis: Thesis) => {
  console.log('Generating DOCX with thesis data:', thesis);

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

  // Front Matter
  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
      },
    },
    children: [
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-5",
        stylesWithLevels: [
          {
            level: 1,
            style: "heading 1",
          } as StyleLevel,
          {
            level: 2,
            style: "heading 2",
          } as StyleLevel,
        ],
      }),
      ...generateContent({ thesis, includeTableOfContents: true }),
    ],
  });

  const doc = new Document({
    sections,
    styles: defaultStyles,
  });

  return doc;
};