import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, convertInchesToTwip } from 'docx';

export const generateTitlePage = ({ title, author, date, university, department, degree }) => {
  return [
    new Paragraph({
      children: [new TextRun({ text: university || '', size: 28 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(2) }
    }),
    new Paragraph({
      children: [new TextRun({ text: department || '', size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.5) }
    }),
    new Paragraph({
      children: [new TextRun({ text: title || '', size: 32, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(2) }
    }),
    new Paragraph({
      children: [new TextRun({ text: 'by', size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1) }
    }),
    new Paragraph({
      children: [new TextRun({ text: author || '', size: 28 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.5) }
    }),
    new Paragraph({
      children: [new TextRun({ text: date || '', size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1) }
    })
  ];
};

export const generateChapterContent = (order, title, content, figures = []) => {
  const paragraphs = [];
  
  // Add chapter title
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: `Chapter ${order}: ${title}`, size: 28, bold: true })],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) }
    })
  );
  
  // Add content
  if (content) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: content, size: 24 })],
        spacing: { before: convertInchesToTwip(0.5) }
      })
    );
  }
  
  return paragraphs;
};

export const generateTableOfContents = (chapters) => {
  const paragraphs = [];
  
  chapters.forEach(({ title, page }) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: title, size: 24 }),
          new TextRun({ text: `${page}`, size: 24 })
        ],
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: convertInchesToTwip(6),
            leader: "dot"
          }
        ]
      })
    );
  });
  
  return paragraphs;
};

export const createParagraph = (content) => {
  return new Paragraph({
    children: [new TextRun({ text: content, size: 24 })],
    spacing: { before: convertInchesToTwip(0.5) }
  });
};