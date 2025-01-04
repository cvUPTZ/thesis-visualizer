import { Thesis } from '@/types/thesis';

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
  thesis: Thesis;
  includeTableOfContents?: boolean;
  includeTitlePage?: boolean;
}

export interface TitlePageOptions {
  thesis: Thesis;
  language?: 'en' | 'fr' | 'ar';
}

export interface ContentGenerationOptions {
  thesis: Thesis;
  includeTableOfContents?: boolean;
}