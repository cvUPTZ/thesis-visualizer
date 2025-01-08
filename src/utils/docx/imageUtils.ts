import { Paragraph, ImageRun, AlignmentType } from 'docx';
import { ImageOptions } from './types';

export const createImage = (options: ImageOptions): Paragraph => {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({
        data: options.data,
        transformation: {
          width: options.width,
          height: options.height,
        },
        fallback: options.fallback,
      }),
    ],
  });
};