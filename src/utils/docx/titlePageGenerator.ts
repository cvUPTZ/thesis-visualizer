import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } from 'docx';
import { TitlePageOptions } from './types';
import { defaultStyles } from './styleConfig';

export const generateTitlePage = ({ thesis, language = 'en' }: TitlePageOptions): Paragraph[] => {
  const { metadata } = thesis;
  const paragraphs: Paragraph[] = [];

  // Find title from frontMatter
  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  const titleText = titleSection?.content || 'Untitled Thesis';

  // University Logo Space
  paragraphs.push(
    new Paragraph({
      text: '',
      spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
    })
  );

  // University Name
  if (metadata.universityName) {
    paragraphs.push(
      new Paragraph({
        text: metadata.universityName.toUpperCase(),
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.25) },
        style: 'title',
      })
    );
  }

  // Department
  if (metadata.departmentName) {
    paragraphs.push(
      new Paragraph({
        text: metadata.departmentName,
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(1) },
        style: 'subtitle',
      })
    );
  }

  // Thesis Title
  paragraphs.push(
    new Paragraph({
      text: titleText,
      style: 'title',
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(2) },
    })
  );

  // Thesis Statement
  paragraphs.push(
    new Paragraph({
      text: 'A thesis submitted in partial fulfillment of the requirements for the degree of',
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.25) },
      style: 'subtitle',
    }),
    new Paragraph({
      text: 'Doctor of Philosophy',
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(1) },
      style: 'subtitle',
    })
  );

  // Author
  if (metadata.authorName) {
    paragraphs.push(
      new Paragraph({
        text: 'by',
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.25) },
        style: 'Normal',
      }),
      new Paragraph({
        text: metadata.authorName,
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(1) },
        style: 'subtitle',
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
        spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(1) },
        style: 'Normal',
      })
    );
  }

  // Committee Members
  if (metadata.committeeMembers && metadata.committeeMembers.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: 'Thesis Committee',
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
        style: 'subtitle',
      })
    );

    metadata.committeeMembers.forEach(member => {
      paragraphs.push(
        new Paragraph({
          text: member,
          alignment: AlignmentType.CENTER,
          spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
          style: 'Normal',
        })
      );
    });
  }

  return paragraphs;
};