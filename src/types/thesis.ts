export type ThesisSectionType =
  | "title"
  | "abstract"
  | "acknowledgments"
  | "table-of-contents"
  | "list-of-figures"
  | "list-of-tables"
  | "introduction"
  | "literature-review"
  | "methodology"
  | "results"
  | "discussion"
  | "conclusion"
  | "recommendations"
  | "references"
  | "appendix"
  | "custom";

export interface Citation {
  id: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  type: 'book' | 'article' | 'conference' | 'website' | 'other';
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
}

export interface Figure {
  id: string;
  caption: string;
  imageUrl: string;
  altText: string;
  number: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface Table {
  id: string;
  caption: string;
  headers: string[];
  rows: string[][];
  number: number;
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: string;
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  type: 'article' | 'book' | 'conference' | 'thesis' | 'website' | 'other';
}

export interface Section {
  id: string;
  title: string;
  content: string;
  type: ThesisSectionType;
  required?: boolean;
  order: number;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references?: Reference[];
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  sections: Section[];
}

export interface ThesisMetadata {
  description: string;
  keywords: string[];
  createdAt: string;
  universityName?: string;
  departmentName?: string;
  authorName?: string;
  thesisDate?: string;
  committeeMembers?: string[];
}

export interface Thesis {
  id: string;
  metadata: ThesisMetadata;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
}
