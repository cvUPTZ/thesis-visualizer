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

export const base64ToUint8Array = (base64: string) => {
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