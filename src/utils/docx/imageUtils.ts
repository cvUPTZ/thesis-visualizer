import { IImageOptions, BorderStyle as DocxBorderStyle } from 'docx';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageBorder {
  style: typeof DocxBorderStyle;
  size: number;
  color: string;
}

export const createImageRun = (
  data: Buffer | Uint8Array,
  dimensions: ImageDimensions,
  border?: ImageBorder
): IImageOptions => {
  const imageOptions: IImageOptions = {
    data,
    transformation: {
      width: dimensions.width,
      height: dimensions.height,
    },
  };

  if (border) {
    imageOptions.borders = {
      top: {
        style: border.style,
        size: border.size,
        color: border.color,
      },
      bottom: {
        style: border.style,
        size: border.size,
        color: border.color,
      },
      left: {
        style: border.style,
        size: border.size,
        color: border.color,
      },
      right: {
        style: border.style,
        size: border.size,
        color: border.color,
      },
    };
  }

  return imageOptions;
};