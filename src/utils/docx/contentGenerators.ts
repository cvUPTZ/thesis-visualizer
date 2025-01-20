import { Paragraph, HeadingLevel, ImageRun } from 'docx';
import { Thesis, Section, Figure } from '@/types/thesis';
import { convertInchesToTwip } from '@/utils/conversion';
import { defaultStyles, previewStyles } from './styleConfig';

interface ContentGenerationOptions {
  thesis: Thesis;
  isPreview?: boolean;
}

const insertFigure = async (figure: Figure): Promise<ImageRun> => {
  try {
    // Convert base64 to binary
    const base64Data = figure.url.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    return new ImageRun({
      data: imageBuffer,
      transformation: {
        width: figure.dimensions.width,
        height: figure.dimensions.height
      }
    });
  } catch (error) {
    console.error('Error processing figure:', error);
    throw error;
  }
};

const processSectionContent = async (section: Section): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];

  // Add content
  if (section.content) {
    paragraphs.push(
      new Paragraph({
        text: section.content,
        style: 'Normal',
        spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) }
      })
    );
  }

  // Add figures
  if (section.figures && section.figures.length > 0) {
    for (const figure of section.figures) {
      try {
        const imageRun = await insertFigure(figure);
        paragraphs.push(
          new Paragraph({
            children: [imageRun],
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.5) }
          })
        );
        
        // Add figure caption
        if (figure.caption) {
          paragraphs.push(
            new Paragraph({
              text: `${figure.label}: ${figure.caption}`,
              style: 'Caption',
              spacing: { before: convertInchesToTwip(0.2), after: convertInchesToTwip(1) }
            })
          );
        }
      } catch (error) {
        console.error(`Failed to process figure ${figure.id}:`, error);
      }
    }
  }

  return paragraphs;
};

export const generateContent = async ({ thesis, isPreview = false }: ContentGenerationOptions): Promise<Paragraph[]> => {
  const paragraphs: Paragraph[] = [];
  const styles = isPreview ? previewStyles : defaultStyles;
  
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
      
      const sectionParagraphs = await processSectionContent(section);
      paragraphs.push(...sectionParagraphs);
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

    const introParagraphs = await processSectionContent(thesis.generalIntroduction);
    paragraphs.push(...introParagraphs);
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

          const sectionParagraphs = await processSectionContent(section);
          paragraphs.push(...sectionParagraphs);
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

    const conclusionParagraphs = await processSectionContent(thesis.generalConclusion);
    paragraphs.push(...conclusionParagraphs);
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

      const sectionParagraphs = await processSectionContent(section);
      paragraphs.push(...sectionParagraphs);
    }
  }

  return paragraphs;
};

export const generateTableOfContents = () => {
  return new Paragraph({
    text: "Table of Contents will be generated automatically",
    style: 'Normal',
    spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(1) },
  });
};