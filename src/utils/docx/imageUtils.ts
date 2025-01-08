import { ImageRun, IImageOptions } from 'docx';

export interface ImageOptions {
  data: Buffer | Uint8Array;
  width: number;
  height: number;
  altText?: string;
}

export const createImage = (options: ImageOptions): ImageRun => {
  const imageOptions: IImageOptions = {
    data: options.data,
    transformation: {
      width: options.width,
      height: options.height
    }
  };
  
  return new ImageRun(imageOptions);
};