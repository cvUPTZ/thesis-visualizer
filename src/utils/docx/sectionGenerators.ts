import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, convertInchesToTwip } from 'docx';

export const createHeading = (text: string, level: keyof typeof HeadingLevel = 'HEADING_1'): Paragraph => {
  return new Paragraph({
    text,
    heading: HeadingLevel[level],
    spacing: { before: 480, after: 240 }
  });
};

export const createParagraph = (text: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 24,
        font: "Times New Roman"
      })
    ],
    spacing: {
      line: 360,
      before: 240,
      after: 120
    }
  });
};

export const generateTableOfContents = (chapters: { title: string; page: number }[]) => {
  return chapters.map(({ title, page }) => 
    new Paragraph({
      children: [
        new TextRun({ text: title }),
        new TextRun({ text: `${page}` })
      ],
      tabStops: [{
        type: TabStopType.RIGHT,
        position: convertInchesToTwip(6),
        leader: "dot"
      }]
    })
  );
};

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

export const generateChapterContent = (order: number, title: string, content: string, figures: any[] = []) => {
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