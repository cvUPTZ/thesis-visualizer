import { Paragraph, TextRun, ImageRun, AlignmentType } from 'docx';
import { Figure } from '@/types/thesis';

export const generateFigures = async (figures: Figure[]) => {
  return Promise.all(figures.map(async (figure) => {
    try {
      const base64Data = figure.imageUrl.split(',')[1];
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      return new Paragraph({
        children: [
          new ImageRun({
            data: bytes,
            transformation: {
              width: figure.dimensions?.width || 400,
              height: figure.dimensions?.height || 300,
            },
            altText: {
              name: figure.caption || 'Figure',
              description: figure.altText || figure.caption || 'Figure image',
            }
          }),
          new TextRun({
            text: `\nFigure ${figure.number}: ${figure.caption}`,
            break: 1,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 240,
          after: 240,
        },
      });
    } catch (error) {
      console.error('Error generating figure:', error);
      return new Paragraph({
        text: `[Error loading figure: ${figure.caption || 'Untitled'}]`,
        alignment: AlignmentType.CENTER,
      });
    }
  }));
};