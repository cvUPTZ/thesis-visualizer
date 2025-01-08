import { IMediaData, IMediaTransformation } from 'docx';

export const createImageRun = (imageData: Buffer | Uint8Array, width: number, height: number) => {
  const transformation: IMediaTransformation = {
    width,
    height
  };

  return {
    data: imageData,
    transformation,
    format: 'png' as const
  };
};