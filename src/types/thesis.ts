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
  Title: 'title',
  Abstract: 'abstract',
  TableOfContents: 'table-of-contents',
  Introduction: 'introduction',
  LiteratureReview: 'literature-review',
  Methodology: 'methodology',
  Results: 'results',
  Discussion: 'discussion',
  Conclusion: 'conclusion',
  References: 'references',
  Custom: 'custom'
} as const;

export type ThesisSectionType = typeof SectionTypes[keyof typeof SectionTypes];

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