import { IImageOptions } from 'docx';

export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const createImageRun = (
  data: Uint8Array,
  dimensions: { width: number; height: number }
): IImageOptions => ({
  data,
  transformation: {
    width: dimensions.width,
    height: dimensions.height,
  },
  type: 'png'
});