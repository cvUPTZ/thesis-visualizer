import { Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { TitlePageOptions } from './types';
import { pageSettings } from './documentStyles';

const generateUniversitySection = (universityName: string, departmentName: string): Paragraph[] => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: universityName.toUpperCase(),
          size: 32,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(0.5) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: departmentName,
          size: 28,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(1) },
    }),
  ];
};

const generateThesisTitle = (title: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        size: 36,
        bold: true,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(2) },
  });
};

const generateDegreeStatement = (): Paragraph[] => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: 'A thesis submitted in partial fulfillment',
          size: 24,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.25) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'of the requirements for the degree of',
          size: 24,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Doctor of Philosophy',
          size: 28,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(1) },
    }),
  ];
};

const generateAuthorSection = (authorName: string): Paragraph[] => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: 'by',
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.25) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: authorName,
          size: 28,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(1) },
    }),
  ];
};

const generateCommitteeSection = (committeeMembers: string[]): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: 'Thesis Committee',
          size: 28,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
    }),
  ];

  committeeMembers.forEach(member => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: member,
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(0.25), after: convertInchesToTwip(0.25) },
      })
    );
  });

  return paragraphs;
};

export const generateTitlePage = ({ thesis }: TitlePageOptions): Paragraph[] => {
  const { metadata } = thesis;
  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  const titleText = titleSection?.content || 'Untitled Thesis';

  const paragraphs: Paragraph[] = [];

  // University and Department
  paragraphs.push(...generateUniversitySection(
    metadata.universityName || 'University Name',
    metadata.departmentName || 'Department Name'
  ));

  // Thesis Title
  paragraphs.push(generateThesisTitle(titleText));

  // Degree Statement
  paragraphs.push(...generateDegreeStatement());

  // Author
  paragraphs.push(...generateAuthorSection(metadata.authorName || 'Author Name'));

  // Date
  if (metadata.thesisDate) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: new Date(metadata.thesisDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            }),
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(1) },
      })
    );
  }

  // Committee Members
  if (metadata.committeeMembers && metadata.committeeMembers.length > 0) {
    paragraphs.push(...generateCommitteeSection(metadata.committeeMembers));
  }

  return paragraphs;
};