import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { TitlePageOptions } from './types';
import { styles } from './styleConfig';

export const generateTitlePage = ({ thesis, language = 'en' }: TitlePageOptions): Paragraph[] => {
  const { metadata } = thesis;
  const paragraphs: Paragraph[] = [];

  // Title
  paragraphs.push(
    new Paragraph({
      text: thesis.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 240 },
    })
  );

  // Author
  if (metadata.authorName) {
    paragraphs.push(
      new Paragraph({
        text: `By ${metadata.authorName}`,
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
      })
    );
  }

  // University and Department
  if (metadata.universityName) {
    paragraphs.push(
      new Paragraph({
        text: metadata.universityName,
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
      })
    );
  }

  if (metadata.departmentName) {
    paragraphs.push(
      new Paragraph({
        text: metadata.departmentName,
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 240 },
      })
    );
  }

  // Date
  if (metadata.thesisDate) {
    paragraphs.push(
      new Paragraph({
        text: new Date(metadata.thesisDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
          year: 'numeric',
          month: 'long',
        }),
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
      })
    );
  }

  return paragraphs;
};