import { IStylesOptions } from 'docx';

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
  normal?: {
    run?: {
      size?: number;
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

export interface ImageOptions {
  width?: number;
  height?: number;
  altText: string;
}

export interface DocPropertiesOptions {
  name: string;
  description: string;
  title: string;
}

export interface DocxGenerationOptions {
  thesis: any;
  includeTableOfContents?: boolean;
  includeTitlePage?: boolean;
}

export interface TitlePageOptions {
  thesis: any;
  language?: 'en' | 'fr' | 'ar';
}

export interface ContentGenerationOptions {
  thesis: any;
  includeTableOfContents?: boolean;
  isPreview?: boolean;
}