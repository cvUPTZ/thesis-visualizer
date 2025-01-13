export interface Collaborator {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in progress' | 'completed' | 'on hold';
  priority: 'low' | 'medium' | 'high';
}

export interface CommentThread {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  replies: CommentThread[];
}

export type ThesisSectionType =
  | 'title'
  | 'preface'
  | 'acknowledgments'
  | 'abstract'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'list-of-tables'
  | 'abbreviations'
  | 'glossary'
  | 'introduction'
  | 'theoretical-framework'
  | 'methodology'
  | 'empirical-study'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'recommendations'
  | 'postface'
  | 'references'
  | 'appendix'
  | 'advice'
  | 'custom';

export interface ThesisMetadata {
  description: string;
  keywords: string[];
  createdAt: string;
  shortTitle?: string;
  institution?: string;
  author?: string;
  degree?: string;
  date?: string;
  universityName?: string;
  departmentName?: string;
  authorName?: string;
  thesisDate?: string;
  committeeMembers?: string[];
}

export interface Thesis {
  id: string;
  title: string;
  content: any;
  metadata: ThesisMetadata;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  language?: string;
  supervisor_email?: string;
  supervisor_id?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  sections: Section[];
  figures: Figure[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
  type: ThesisSectionType;
  required?: boolean;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references?: Reference[];
  tasks: Task[];
}

export interface Figure {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  altText: string;
  number: number;
  dimensions?: {
    width: number;
    height: number;
  };
  position: 'left' | 'center' | 'right';
  customWidth?: number;
  customHeight?: number;
  border?: {
    style: 'single' | 'double' | 'thick' | 'none';
    size: number;
    color: string;
  };
}

export interface Table {
  id: string;
  title: string;
  caption: string;
  content: string[][];
  number: number;
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  type: 'article' | 'book' | 'conference' | 'website' | 'other';
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
  type: 'article' | 'book' | 'conference' | 'thesis' | 'website' | 'other';
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
}

export interface ThesisVersion {
  id: string;
  thesis_id: string;
  content: any;
  version_number: number;
  description?: string;
  created_at: string;
  created_by: string;
}

export interface ThesisComment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  replies: ThesisComment[];
}
