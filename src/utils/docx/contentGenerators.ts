import { Document, Paragraph, TextRun, ImageRun, HeadingLevel, TableOfContents, IImageOptions } from 'docx';
import { Thesis, Section, Chapter } from '@/types/thesis';

export const generateImageParagraph = async (imageData: Buffer, caption: string) => {
  const imageOptions: IImageOptions = {
    data: imageData,
    transformation: {
      width: 400,
      height: 300,
    },
    type: 'png'
  };

  const image = new ImageRun(imageOptions);

  return new Paragraph({
    children: [
      image,
      new TextRun({
        text: caption,
        break: 1
      })
    ]
  });
};

export const generateTableOfContents = () => {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-5",
  });
};

export const generateContent = async ({ thesis, isPreview = false }: { thesis: Thesis, isPreview?: boolean }): Promise<Paragraph[]> => {
  const content: Paragraph[] = [];

  // Validate thesis structure
  if (!thesis || typeof thesis !== 'object') {
    throw new Error('Invalid thesis object');
  }
  if (!Array.isArray(thesis.frontMatter)) {
    throw new Error('Invalid front matter structure');
  }
  if (!Array.isArray(thesis.chapters)) {
    throw new Error('Invalid chapters structure');
  }
  if (!Array.isArray(thesis.backMatter)) {
    throw new Error('Invalid back matter structure');
  }
  if (thesis.chapters.some(chapter => !Array.isArray(chapter.sections))) {
    throw new Error('Invalid chapter sections structure');
  }
  if (thesis.frontMatter.some(section => typeof section !== 'object')) {
    throw new Error('Invalid front matter section structure');
  }
  if (thesis.backMatter.some(section => typeof section !== 'object')) {
    throw new Error('Invalid back matter section structure');
  }
  if (thesis.chapters.some(chapter => typeof chapter !== 'object')) {
    throw new Error('Invalid chapter structure');
  }
  if (thesis.chapters.some(chapter => chapter.sections.some(section => typeof section !== 'object'))) {
    throw new Error('Invalid chapter section structure');
  }

  // Add general introduction if exists
  if (thesis.generalIntroduction) {
    content.push(new Paragraph({
      text: thesis.generalIntroduction.title,
      heading: HeadingLevel.HEADING_1,
    }));
    content.push(new Paragraph({
      text: thesis.generalIntroduction.content
    }));
  }

  // Add front matter sections
  thesis.frontMatter.forEach(section => {
    content.push(new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_2,
    }));
    content.push(new Paragraph({
      text: section.content
    }));
  });

  // Add chapters
  thesis.chapters.forEach(chapter => {
    content.push(new Paragraph({
      text: chapter.title,
      heading: HeadingLevel.HEADING_1,
    }));

    chapter.sections.forEach(section => {
      content.push(new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
      }));
      content.push(new Paragraph({
        text: section.content
      }));
    });
  });

  // Add general conclusion if exists
  if (thesis.generalConclusion) {
    content.push(new Paragraph({
      text: thesis.generalConclusion.title,
      heading: HeadingLevel.HEADING_1,
    }));
    content.push(new Paragraph({
      text: thesis.generalConclusion.content
    }));
  }

  // Add back matter sections
  thesis.backMatter.forEach(section => {
    content.push(new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_2,
    }));
    content.push(new Paragraph({
      text: section.content
    }));
  });

  return content;
};