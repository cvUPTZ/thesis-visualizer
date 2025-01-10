import { HeadingLevel, IParagraphOptions, IRunOptions, convertInchesToTwip, AlignmentType } from 'docx';

export const createHeading = (text: string, level: typeof HeadingLevel, chapterNumber?: number) => ({
  text: chapterNumber ? `CHAPTER ${chapterNumber}\n${text}` : text,
  heading: level,
  spacing: {
    before: 480,
    after: 240
  },
  alignment: AlignmentType.CENTER
});

export const createParagraph = (text: string, options?: IParagraphOptions) => ({
  text,
  ...options,
  paragraph: {
    ...options?.paragraph,
    indent: {
      firstLine: convertInchesToTwip(0.5)
    },
    spacing: {
      line: 360,
      ...options?.paragraph?.spacing
    }
  }
});

export const createBlockQuote = (text: string) => ({
  text,
  style: "BlockQuote"
});

export const createCaption = (text: string, type: 'figure' | 'table', number: string) => ({
  text: `${type === 'figure' ? 'Figure' : 'Table'} ${number}: ${text}`,
  style: "Caption",
  alignment: AlignmentType.CENTER
});

export const createSection = (content: any[], options?: { 
  pageNumberFormat?: 'decimal' | 'lowerRoman',
  pageNumberStart?: number 
}) => ({
  children: content,
  properties: {
    page: {
      margin: {
        top: convertInchesToTwip(1),
        right: convertInchesToTwip(1),
        bottom: convertInchesToTwip(1),
        left: convertInchesToTwip(1.5)
      },
      pageNumbers: options?.pageNumberFormat ? {
        start: options.pageNumberStart || 1,
        formatType: options.pageNumberFormat
      } : undefined
    }
  }
});