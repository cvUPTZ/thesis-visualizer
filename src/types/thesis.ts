export interface Thesis {
  id: string;
  title: string;
  content: any;
  user_id: string;
  created_at: string;
  updated_at: string;
  metadata: ThesisMetadata;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
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

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
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

export type ThesisSectionType = 
  | 'title'
  | 'abstract'
  | 'acknowledgments'
  | 'introduction'
  | 'literature-review'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'references'
  | 'appendix'
  | 'custom';

export interface Figure {
  id: string;
  caption: string;
  imageUrl: string;
  altText: string;
  number: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface Table {
  id: string;
  title: string;
  caption: string;
  content: string;
}

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
  thesis_id: string;
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: string;
  type: 'article' | 'book' | 'conference' | 'thesis' | 'website' | 'other';
}

export interface ThesisComment {
  id: string;
  content: string;
  user_id: string;
  parent_id?: string;
  created_at: string;
  thesis_id: string;
}

export interface CommentThread {
  comment: ThesisComment;
  replies: ThesisComment[];
}