import { IMediaData, IMediaTransformation } from 'docx';

export const createImageRun = (imageData: Buffer | Uint8Array, width: number, height: number) => {
  const transformation: IMediaTransformation = {
    width,
    height,
    pixels: {
      x: width,
      y: height
    },
    emus: {
      x: width * 9525,
      y: height * 9525
    }
  };

  return {
    data: imageData,
    transformation,
    format: 'png' as const
  };
};