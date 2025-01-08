import { IStylesOptions } from 'docx';
import { Thesis } from '@/types/thesis';

export interface DocxGenerationOptions {
  thesis: Thesis;
  includeTableOfContents?: boolean;
  includeTitlePage?: boolean;
  isPreview?: boolean;
}

export interface ContentGenerationOptions {
  thesis: Thesis;
  isPreview?: boolean;
}

export interface ImageOptions {
  data: Buffer;
  transformation: {
    width: number;
    height: number;
  };
  type?: string;
  fallback?: string;
}

export interface DocPropertiesOptions {
  name: string;
  description: string;
  title: string;
}

export interface TitlePageOptions {
  thesis: Thesis;
}

export interface TableContent {
  headers: string[];
  rows: string[][];
}

export interface StyleConfig extends IStylesOptions {
  heading1?: {
    run?: {
      size?: number;
      bold?: boolean;
      color?: string;
    };
    paragraph?: {
      spacing?: {
        before?: number;
        after?: number;
      };
      alignment?: string;
    };
  };
  heading2?: {
    run?: {
      size?: number;
      bold?: boolean;
      color?: string;
    };
    paragraph?: {
      spacing?: {
        before?: number;
        after?: number;
      };
      alignment?: string;
    };
  };
}