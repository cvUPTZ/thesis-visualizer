import {
  Document,
  Paragraph,
  TextRun,
  PageBreak,
  AlignmentType,
  convertInchesToTwip,
} from 'docx';
import { documentStyles, pageSettings } from './docx/documentStyles';
import { generateTitlePage, generateAbstractSection, generateChapterContent, generateTableOfContents } from './docx/sectionGenerators';
import { Thesis } from '@/types/thesis';

export const createThesisDocument = (thesis: Thesis) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          ...pageSettings.page,
        },
        children: [
          generateTitlePage(thesis),
          new PageBreak(),
          generateAbstractSection(thesis),
          new PageBreak(),
          generateTableOfContents(thesis),
          new PageBreak(),
          ...thesis.chapters.map(chapter => generateChapterContent(chapter)),
        ],
      },
    ],
  });

  return doc;
};
