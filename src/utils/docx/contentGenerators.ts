import { HeadingLevel, IParagraphOptions, IRunOptions, convertInchesToTwip, AlignmentType, Paragraph, TextRun } from 'docx';

export const createHeading = (text: string, level: keyof typeof HeadingLevel, chapterNumber?: number): IParagraphOptions => ({
  text: chapterNumber ? `CHAPTER ${chapterNumber}\n${text}` : text,
  heading: HeadingLevel[level],
  spacing: {
    before: 480,
    after: 240
  },
  alignment: AlignmentType.CENTER
});

export const createParagraph = (text: string, options?: Partial<IParagraphOptions>): IParagraphOptions => ({
  ...options,
  children: [
    new TextRun({
      text,
      size: 24, // 12pt
      font: "Times New Roman"
    })
  ],
  spacing: {
    line: 360, // 1.5 spacing
    before: 0,
    after: 0,
    ...options?.spacing
  },
  indent: {
    firstLine: convertInchesToTwip(0.5),
    ...options?.indent
  }
});

export const createBlockQuote = (text: string): IParagraphOptions => ({
  children: [
    new TextRun({
      text,
      size: 24,
      font: "Times New Roman"
    })
  ],
  spacing: {
    line: 240, // single spacing
    before: 240,
    after: 240
  },
  indent: {
    left: convertInchesToTwip(0.5),
    right: convertInchesToTwip(0.5)
  }
});

export const createCaption = (text: string, type: 'figure' | 'table', number: string): IParagraphOptions => ({
  children: [
    new TextRun({
      text: `${type === 'figure' ? 'Figure' : 'Table'} ${number}: ${text}`,
      size: 20, // 10pt
      font: "Times New Roman"
    })
  ],
  spacing: {
    line: 240, // single spacing
    before: 120,
    after: 120
  },
  alignment: AlignmentType.CENTER
});