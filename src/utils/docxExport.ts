import { 
  Document, 
  TableOfContents,
  convertInchesToTwip,
} from 'docx';
import { ThesisContent } from './docx/types';
import { generateTitlePage } from './docx/titlePageGenerator';
import { generateSectionContent, generateChapterContent } from './docx/contentGenerators';
import { defaultStyles } from './docx/styleConfig';

const PAGE_WIDTH = convertInchesToTwip(8.5);
const PAGE_MARGINS = {
  top: convertInchesToTwip(1),
  right: convertInchesToTwip(1),
  bottom: convertInchesToTwip(1),
  left: convertInchesToTwip(1),
};

export const generateThesisDocx = async (thesis: ThesisContent) => {
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
    children: generateTitlePage(thesis.metadata),
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
          { level: 1, heading: "Heading1" },
          { level: 2, heading: "Heading2" },
        ],
      }),
      ...await generateSectionContent(thesis.frontMatter),
    ],
  });

  // Main Content
  const mainContent = [
    ...await generateChapterContent(thesis.chapters),
    ...await generateSectionContent(thesis.backMatter),
  ];

  sections.push({
    properties: {
      page: {
        margin: PAGE_MARGINS,
      },
    },
    children: mainContent,
  });

  const doc = new Document({
    sections,
    styles: defaultStyles,
  });

  return doc;
};