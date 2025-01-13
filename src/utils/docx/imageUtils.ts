import { IMediaData, IMediaTransformation, BorderStyle } from 'docx';

interface ImageOptions {
  width: number;
  height: number;
  position?: 'left' | 'center' | 'right';
  border?: {
    style: 'single' | 'double' | 'thick' | 'none';
    size: number;
    color: string;
  };
}

export const createImageRun = (imageData: Buffer | Uint8Array, options: ImageOptions) => {
  const transformation: IMediaTransformation = {
    width: options.width,
    height: options.height
  };

  const borders = options.border?.style !== 'none' ? {
    top: {
      style: getBorderStyle(options.border.style),
      size: options.border.size,
      color: options.border.color.replace('#', '')
    },
    bottom: {
      style: getBorderStyle(options.border.style),
      size: options.border.size,
      color: options.border.color.replace('#', '')
    },
    left: {
      style: getBorderStyle(options.border.style),
      size: options.border.size,
      color: options.border.color.replace('#', '')
    },
    right: {
      style: getBorderStyle(options.border.style),
      size: options.border.size,
      color: options.border.color.replace('#', '')
    }
  } : undefined;

  return {
    data: imageData,
    transformation,
    borders,
    floating: options.position ? {
      horizontalPosition: {
        relative: "margin",
        align: options.position
      }
    } : undefined
  };
};

const getBorderStyle = (style: 'single' | 'double' | 'thick' | 'none'): BorderStyle => {
  switch (style) {
    case 'single':
      return BorderStyle.SINGLE;
    case 'double':
      return BorderStyle.DOUBLE;
    case 'thick':
      return BorderStyle.THICK;
    default:
      return BorderStyle.NONE;
  }
};