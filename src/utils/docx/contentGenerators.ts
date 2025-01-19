import { Document, Paragraph, TextRun, TableOfContents, HeadingLevel, ImageRun } from 'docx';
import { Chapter, Section } from '@/types/thesis';

export const generateTableOfContents = () => {
  return new TableOfContents("Table of Contents", {
    hyperlink: true,
    headingStyleRange: '1-3',
    stylesWithLevels: [
      {
        level: 0,
        styleRunProperties: {
          bold: true,
          size: 28,
        }
      },
      {
        level: 1,
        styleRunProperties: {
          bold: true,
          size: 24,
        }
      },
      {
        level: 2,
        styleRunProperties: {
          size: 24,
        }
      }
    ]
  });
};

export const generateContent = async (content: string, images: { [key: string]: Buffer }) => {
  const paragraphs: Paragraph[] = [];
  
  // Process content and create paragraphs
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('![')) {
      // Handle image
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (match && match[2] && images[match[2]]) {
        const imageData = images[match[2]];
        const imageRun = new ImageRun({
          data: imageData,
          transformation: {
            width: 400,
            height: 300
          },
          altText: match[1] || 'Image'
        });
        paragraphs.push(new Paragraph({ children: [imageRun] }));
      }
    } else {
      // Handle text
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              name: 'Arial',
              docProperties: {
                title: 'Content',
                description: 'Document content'
              }
            })
          ]
        })
      );
    }
  }
  
  return paragraphs;
};