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
}

export interface DocxGenerationOptions {
  thesis: any;
  includeTableOfContents?: boolean;
  includeTitlePage?: boolean;
  isPreview?: boolean;
}