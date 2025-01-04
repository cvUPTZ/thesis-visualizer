import { Paragraph, AlignmentType, convertInchesToTwip } from 'docx';
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
    }),
    new Paragraph({
      text: metadata?.departmentName || "Department Name",
      alignment: AlignmentType.CENTER,
      spacing: {
        after: convertInchesToTwip(2),
      },
      style: "Normal",
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
        text: "Thesis Committee:",
        alignment: AlignmentType.CENTER,
        spacing: {
          before: convertInchesToTwip(1),
        },
        style: "Normal",
      }),
      ...metadata.committeeMembers.map(
        (member) =>
          new Paragraph({
            text: member,
            alignment: AlignmentType.CENTER,
            style: "Normal",
          })
      )
    );
  }

  return children;
};