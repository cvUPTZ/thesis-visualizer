import { Thesis, Chapter, Section } from '@/types/thesis';

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