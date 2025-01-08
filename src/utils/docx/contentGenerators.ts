import { HeadingLevel, IParagraphOptions, IRunOptions } from 'docx';

export const createHeading = (text: string, level: typeof HeadingLevel) => ({
  text,
  heading: level,
  spacing: {
    before: 240,
    after: 120
  }
});

export const createParagraph = (text: string, options?: IParagraphOptions) => ({
  text,
  ...options,
  run: {
    italics: true // Changed from italic to italics
  }
});

export const createSection = (content: any[]) => ({
  children: content,
  properties: {
    page: {
      margin: {
        top: 1440,
        right: 1440,
        bottom: 1440,
        left: 1440
      }
    }
  }
});