import { ImageRun, IImageOptions } from 'docx';

export const createImageRun = async (imageUrl: string, caption?: string): Promise<ImageRun> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const options: IImageOptions = {
      data: arrayBuffer,
      transformation: {
        width: 400,
        height: 300,
      },
      altText: {
        name: caption || 'Thesis figure',
        description: caption || 'Thesis figure',
      },
      type: 'png',
      fallback: {
        data: arrayBuffer,
        type: 'png',
      }
    };

    return new ImageRun(options);
  } catch (error) {
    console.error('Error creating image run:', error);
    throw error;
  }
};