import { Paragraph, HeadingLevel } from 'docx';
import { Thesis, Section } from '@/types/thesis';
import { convertInchesToTwip } from '@/utils/conversion';

interface ContentGenerationOptions {
  thesis: Thesis;
  isPreview?: boolean;
}

export const generateContent = async ({ thesis, isPreview = false }: ContentGenerationOptions): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;
  let currentFigureNumber = 1;

  // Front Matter
  if (Array.isArray(thesis.frontMatter)) {
    for (const section of thesis.frontMatter) {
      if (section.title) {
        paragraphs.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
          })
        );
      }
      
      if (section.content) {
        paragraphs.push(
          new Paragraph({
            text: section.content,
            style: 'Normal',
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
          })
        );
      }
    }
  }

  // General Introduction
  if (thesis.generalIntroduction) {
    paragraphs.push(
      new Paragraph({
        text: thesis.generalIntroduction.title || "General Introduction",
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      })
    );

    if (thesis.generalIntroduction.content) {
      paragraphs.push(
        new Paragraph({
          text: thesis.generalIntroduction.content,
          style: 'Normal',
          spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
        })
      );
    }
  }

  // Chapters
  if (Array.isArray(thesis.chapters)) {
    for (const chapter of thesis.chapters) {
      if (chapter.title) {
        paragraphs.push(
          new Paragraph({
            text: chapter.title,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
          })
        );
      }

      if (Array.isArray(chapter.sections)) {
        for (const section of chapter.sections) {
          if (section.title) {
            paragraphs.push(
              new Paragraph({
                text: section.title,
                heading: HeadingLevel.HEADING_2,
                pageBreakBefore: true,
              })
            );
          }

          if (section.content) {
            paragraphs.push(
              new Paragraph({
                text: section.content,
                style: 'Normal',
                spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
              })
            );
          }
        }
      }
    }
  }

  // General Conclusion
  if (thesis.generalConclusion) {
    paragraphs.push(
      new Paragraph({
        text: thesis.generalConclusion.title || "General Conclusion",
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      })
    );

    if (thesis.generalConclusion.content) {
      paragraphs.push(
        new Paragraph({
          text: thesis.generalConclusion.content,
          style: 'Normal',
          spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
        })
      );
    }
  }

  // Back Matter
  if (Array.isArray(thesis.backMatter)) {
    for (const section of thesis.backMatter) {
      if (section.title) {
        paragraphs.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
          })
        );
      }

      if (section.content) {
        paragraphs.push(
          new Paragraph({
            text: section.content,
            style: 'Normal',
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
          })
        );
      }
    }
  }

  return paragraphs;
};
