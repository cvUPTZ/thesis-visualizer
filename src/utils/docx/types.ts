import { StyleLevel } from 'docx';

export interface ThesisMetadata {
  universityName?: string;
  departmentName?: string;
  authorName?: string;
  thesisDate?: string;
  committeeMembers?: string[];
}

export interface ThesisContent {
  frontMatter: any[];
  chapters: any[];
  backMatter: any[];
  metadata?: ThesisMetadata;
}

export interface DocxImageOptions {
  data: Uint8Array;
  width?: number;
  height?: number;
  altText?: {
    name: string;
    description: string;
  };
}

export interface StyleConfig {
  paragraphStyles: {
    id: string;
    name: string;
    basedOn: string;
    next: string;
    quickFormat: boolean;
    run: {
      size: number;
      bold?: boolean;
      font: string;
    };
    paragraph: {
      spacing: {
        line?: number;
        before: number;
        after: number;
      };
    };
  }[];
}