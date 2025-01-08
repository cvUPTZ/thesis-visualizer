import { IImageOptions, IMediaData } from 'docx';

interface ImageTransformation {
  width: number;
  height: number;
}

export const createImageRun = (imageData: Buffer | Uint8Array, transformation: ImageTransformation): IImageOptions & IMediaData => {
  return {
    data: imageData,
    transformation: {
      width: transformation.width,
      height: transformation.height,
    },
    type: 'image',
  };
};