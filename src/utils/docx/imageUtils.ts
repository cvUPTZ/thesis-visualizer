import { IImageOptions, BorderStyle } from 'docx';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageBorder {
  style: typeof BorderStyle;
  size: number;
  color: string;
}


export const createImageRun = (
  data: Buffer | Uint8Array,
  dimensions: ImageDimensions,
  border?: ImageBorder
): IImageOptions => ({
  data,
  transformation: {
    width: dimensions.width,
    height: dimensions.height,
  },
    type: 'png',
  fallback: {
        width: dimensions.width,
        height: dimensions.height,
      }
});