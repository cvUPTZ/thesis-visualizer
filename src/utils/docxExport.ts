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
          ...generateTitlePage({
            title: thesis.title,
            author: thesis.metadata?.authorName || '',
            date: thesis.metadata?.thesisDate || '',
            university: thesis.metadata?.universityName || '',
            department: thesis.metadata?.departmentName || '',
            degree: thesis.metadata?.degree || '',
          }),
          new Paragraph({ children: [new PageBreak()] }),
          ...generateAbstractSection(thesis.abstract || ''),
          new Paragraph({ children: [new PageBreak()] }),
          ...generateTableOfContents(thesis.chapters?.map((chapter, index) => ({
            title: chapter.title,
            page: index + 3
          })) || []),
          new Paragraph({ children: [new PageBreak()] }),
          ...(thesis.chapters?.flatMap(chapter => 
            generateChapterContent(
              chapter.order + 1, 
              chapter.title, 
              chapter.content,
              chapter.figures
            )
          ) || []),
        ],
      },
    ],
    styles: documentStyles,
  });

  return doc;
};