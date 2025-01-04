import { ImageOptions, DocPropertiesOptions } from './types';

export const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const getImageOptions = (altText: string): DocPropertiesOptions => ({
  name: altText,
  description: altText,
  title: altText // Add the required title property
});