import { Paragraph, TextRun, AlignmentType, convertInchesToTwip, HeadingLevel } from 'docx';
import { ThesisMetadata } from './types';

export const generateTitlePage = (metadata?: ThesisMetadata) => {
  const children = [
    new Paragraph({
      text: metadata?.universityName || "University Name",
      alignment: AlignmentType.CENTER,
      spacing: {
        before: convertInchesToTwip(2),
        after: convertInchesToTwip(0.5),
      },
      style: "Heading1",
      children: [
        new TextRun({
          text: metadata?.universityName || "University Name",
          size: 36,
          bold: true,
          color: "2E5090",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: convertInchesToTwip(2),
      },
      children: [
        new TextRun({
          text: metadata?.departmentName || "Department Name",
          size: 28,
          italics: true,
          color: "666666",
        }),
      ],
    }),
    new Paragraph({
      text: "A Thesis Submitted in Partial Fulfillment",
      alignment: AlignmentType.CENTER,
      style: "Normal",
    }),
    new Paragraph({
      text: "of the Requirements for the Degree of",
      alignment: AlignmentType.CENTER,
      style: "Normal",
    }),
    new Paragraph({
      text: "Doctor of Philosophy",
      alignment: AlignmentType.CENTER,
      spacing: {
        after: convertInchesToTwip(2),
      },
      style: "Normal",
    }),
    new Paragraph({
      text: "by",
      alignment: AlignmentType.CENTER,
      style: "Normal",
    }),
    new Paragraph({
      text: metadata?.authorName || "Author Name",
      alignment: AlignmentType.CENTER,
      spacing: {
        after: convertInchesToTwip(2),
      },
      style: "Normal",
    }),
    new Paragraph({
      text: metadata?.thesisDate || "Month Year",
      alignment: AlignmentType.CENTER,
      style: "Normal",
    }),
  ];

  if (metadata?.committeeMembers?.length) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: convertInchesToTwip(1),
        },
        children: [
          new TextRun({
            text: "Thesis Committee:",
            size: 24,
            bold: true,
            color: "2E5090",
          }),
        ],
      }),
      ...metadata.committeeMembers.map(
        (member) =>
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: member,
                size: 24,
                color: "666666",
              }),
            ],
          })
      )
    );
  }

  return children;
};
