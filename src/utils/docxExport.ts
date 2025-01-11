import {
  Document,
  Paragraph,
  TextRun,
  PageBreak,
  AlignmentType,
  convertInchesToTwip,
  ISectionOptions,
} from 'docx';
import { documentStyles, pageSettings } from './docx/documentStyles';
import { generateTitlePage, generateAbstractSection, generateChapterContent, generateTableOfContents } from './docx/sectionGenerators';
import { Thesis } from '@/types/thesis';

export const generateThesisDocx = (thesis: Thesis): Document => {
  const doc = new Document({
    sections: [
      {
        ...pageSettings.page,
        children: [
          ...generateTitlePage(thesis),
          new PageBreak(),
          ...generateAbstractSection(thesis.frontMatter[0]?.content || ''),
          new PageBreak(),
          ...generateTableOfContents(thesis.chapters.map(chapter => ({
            title: chapter.title,
            page: chapter.order + 1
          }))),
          new PageBreak(),
          ...thesis.chapters.flatMap(chapter => generateChapterContent(chapter.order + 1, chapter.title, chapter.content)),
        ],
      },
    ],
    styles: documentStyles,
  });

  return doc;
};