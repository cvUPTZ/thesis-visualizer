import { Document, Paragraph, TextRun, ImageRun, HeadingLevel } from 'docx';
import { Thesis, Section, Chapter } from '@/types/thesis';

export const generateImageParagraph = async (imageData: Buffer, caption: string) => {
  const imageRun = new ImageRun({
    data: imageData,
    transformation: {
      width: 400,
      height: 300,
    },
    type: 'png', // Add the type property
    fallback: {  // Add the fallback property
      data: imageData,
      width: 400,
      height: 300,
    }
  });

  return new Paragraph({
    children: [
      imageRun,
      new TextRun({
        text: caption,
        break: 1
      })
    ]
  });
};

// Function to generate document content from thesis
export const generateThesisContent = (thesis: Thesis) => {
  const content: Paragraph[] = [];

  // Add general introduction if exists
  if (thesis.generalIntroduction) {
    content.push(new Paragraph({
      text: thesis.generalIntroduction.title,
      heading: HeadingLevel.HEADING_1,
    }));
    content.push(new Paragraph(thesis.generalIntroduction.content));
  }

  // Add front matter sections
  thesis.frontMatter.forEach((section: Section) => {
    content.push(new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_2,
    }));
    content.push(new Paragraph(section.content));
  });

  // Add chapters
  thesis.chapters.forEach((chapter: Chapter) => {
    content.push(new Paragraph({
      text: chapter.title,
      heading: HeadingLevel.HEADING_1,
    }));
    chapter.sections.forEach((section: Section) => {
      content.push(new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
      }));
      content.push(new Paragraph(section.content));
    });
  });

  // Add general conclusion if exists
  if (thesis.generalConclusion) {
    content.push(new Paragraph({
      text: thesis.generalConclusion.title,
      heading: HeadingLevel.HEADING_1,
    }));
    content.push(new Paragraph(thesis.generalConclusion.content));
  }

  // Add back matter sections
  thesis.backMatter.forEach((section: Section) => {
    content.push(new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_2,
    }));
    content.push(new Paragraph(section.content));
  });

  return content;
};
