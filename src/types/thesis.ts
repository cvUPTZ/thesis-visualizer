// Basic types
export interface Figure {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  altText: string;
  number: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface Table {
  id: string;
  title?: string;
  content: string;
  caption?: string;
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  type: string;
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  thesis_id: string;
  created_at: string;
  updated_at: string;
}

export interface Reference {
  id: string;
  text: string;
  title: string;
  source: string;
  authors: string[];
  year: string;
  type: string;
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
}

export interface Footnote {
  id: string;
  content: string;
  number: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  reviewer_id: string;
  content: string;
  created_at: string;
}

export interface CommentThread {
  id: string;
  content: string;
  author: string;
  created_at: string;
  comment: Comment;
  replies: Comment[];
}

export interface ThesisVersion {
  id: string;
  version_number: number;
  created_at: string;
  description?: string;
}

export interface ThesisComment {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

// Section types as const enum

export const SectionTypes = {
  // Auto-generated Front Matter
  'title': 'title',
  'table-of-contents': 'table-of-contents',
  'list-of-figures': 'list-of-figures',
  'list-of-tables': 'list-of-tables',
  
  // User-created Front Matter
  'acknowledgments': 'acknowledgments',
  'abstract': 'abstract',
  'list-of-abbreviations': 'list-of-abbreviations',
  
  // Main Content
  'general-introduction': 'general-introduction',
  'introduction': 'introduction',
  'literature-review': 'literature-review',
  'methodology': 'methodology',
  'results': 'results',
  'discussion': 'discussion',
  'conclusion': 'conclusion',
  'references': 'references',
  
  // Back Matter
  'bibliography': 'bibliography',
  'primary-sources': 'primary-sources',
  'secondary-sources': 'secondary-sources',
  'electronic-sources': 'electronic-sources',
  'appendix': 'appendix',
  'collection-tools': 'collection-tools',
  'raw-data': 'raw-data',
  'detailed-analysis': 'detailed-analysis',
  'supporting-documents': 'supporting-documents',
  'reference-tables': 'reference-tables',
  'index': 'index',
  'glossary': 'glossary',
  'detailed-toc': 'detailed-toc',
  'custom': 'custom'
} as const;

export type ThesisSectionType = keyof typeof SectionTypes;

// Main interfaces
export interface Section {
  id: string;
  title: string;
  content: string;
  type: ThesisSectionType;
  order: number;
  required?: boolean;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references?: Reference[];
  footnotes?: Footnote[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  sections: Section[];
  part: number;
  figures: Figure[];
  tables: Table[];
  footnotes: Footnote[];
}

export interface ThesisMetadata {
  universityName: string;
  departmentName: string;
  authorName: string;
  thesisDate: string;
  committeeMembers: string[];
  description?: string;
  keywords?: string[];
  createdAt: string;
}

export interface Thesis {
  id: string;
  title: string;
  content: {
    generalIntroduction: string;
    metadata: ThesisMetadata;
  };
  metadata: ThesisMetadata;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  user_id: string;
  created_at: string;
  updated_at: string;
}
