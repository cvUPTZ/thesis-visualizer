import { 
  Paragraph, 
  TextRun, 
  TableOfContents,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  IImageOptions,
  convertInchesToTwip
} from 'docx';
import { Chapter, Section, Thesis } from '@/types/thesis';

export const generateTableOfContents = () => {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: "1-5",
    stylesWithLevels: [
      { level: 1, styleId: "Heading1" },
      { level: 2, styleId: "Heading2" },
      { level: 3, styleId: "Heading3" },
    ],
  });
};

export const generateContent = ({ thesis, isPreview = false }: { thesis: Thesis; isPreview?: boolean }) => {
  const content: Paragraph[] = [];

  // Generate front matter content
  if (thesis.frontMatter) {
    for (const section of thesis.frontMatter) {
      content.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      // Split content into paragraphs
      const paragraphs = section.content.split('\n');
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph.trim(),
                  size: 24
                })
              ],
              spacing: { before: 200, after: 200 }
            })
          );
        }
      }

      // Add figures if present
      if (section.figures && section.figures.length > 0) {
        for (const figure of section.figures) {
          try {
            content.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: Buffer.from(figure.imageUrl),
                    transformation: {
                      width: figure.dimensions.width,
                      height: figure.dimensions.height
                    },
                    altText: figure.altText
                  } as IImageOptions)
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Figure ${figure.number}: ${figure.caption}`,
                    italics: true
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 400 }
              })
            );
          } catch (error) {
            console.error('Error processing figure:', error);
          }
        }
      }
    }
  }

  // Generate chapter content
  if (thesis.chapters) {
    for (const chapter of thesis.chapters) {
      content.push(
        new Paragraph({
          text: chapter.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      if (chapter.sections) {
        for (const section of chapter.sections) {
          content.push(
            new Paragraph({
              text: section.title,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 }
            })
          );

          const paragraphs = section.content.split('\n');
          for (const paragraph of paragraphs) {
            if (paragraph.trim()) {
              content.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: paragraph.trim(),
                      size: 24
                    })
                  ],
                  spacing: { before: 200, after: 200 }
                })
              );
            }
          }
        }
      }
    }
  }

  return content;
};