import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun } from 'docx';
import { Chapter, Section, ThesisSectionType } from '@/types/thesis';

export const generateContent = async (
  frontMatter: Section[],
  chapters: Chapter[],
  backMatter: Section[]
) => {
  const content: any[] = [];

  // Generate front matter content
  for (const section of frontMatter) {
    content.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 200
        }
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
            spacing: {
              before: 200,
              after: 200
            }
          })
        );
      }
    }

    // Add figures if present
    if (section.figures && section.figures.length > 0) {
      for (const figure of section.figures) {
        try {
          const imageBlob = await fetch(figure.imageUrl).then(r => r.blob());
          const buffer = await imageBlob.arrayBuffer();
          
          content.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffer,
                  transformation: {
                    width: figure.dimensions.width,
                    height: figure.dimensions.height
                  }
                })
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
              spacing: {
                before: 100,
                after: 400
              }
            })
          );
        } catch (error) {
          console.error('Error processing figure:', error);
        }
      }
    }
  }

  // Generate chapter content
  for (const chapter of chapters) {
    content.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 200
        }
      })
    );

    for (const section of chapter.sections) {
      content.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 300,
            after: 200
          }
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
              spacing: {
                before: 200,
                after: 200
              }
            })
          );
        }
      }
    }
  }

  // Generate back matter content
  for (const section of backMatter) {
    content.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 200
        }
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
            spacing: {
              before: 200,
              after: 200
            }
          })
        );
      }
    }
  }

  return content;
};