export interface Citation {
  id: string;
  text: string;
  authors: string[];
  type: string;
  created_at: string;
  updated_at: string;
  
  // Author Information
  author_last_names: string[];
  author_first_initials: string[];
  author_middle_initials: string[];
  
  // Date Information
  year: string;
  specific_date?: string;
  
  // Title Information
  title: string;
  container_title?: string;
  edition?: string;
  
  // Publication Information
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  database?: string;
  source: string;
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
  specific_date?: string;
  container_title?: string;
  edition?: string;
  created_at: string;
  updated_at: string;
}

export type ReferenceStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard';

export interface Chapter {
  id: string;
  title: string;
  content: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  type?: string;
  figures?: Figure[];
  tables?: Table[];
  citations?: Citation[];
  references?: Reference[];
}

export interface Figure {
  id: string;
  caption: string;
  url: string;
  alt_text?: string;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  caption: string;
  data: any[][];
  created_at: string;
  updated_at: string;
}

export interface Footnote {
  id: string;
  content: string;
  number: number;
  created_at: string;
  updated_at: string;
}

export interface ThesisMetadata {
  description: string;
  keywords: string[];
  createdAt: string;
  universityName: string;
  departmentName: string;
  authorName: string;
  thesisDate: string;
  committeeMembers: string[];
}

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
  user_id: string;
  created_at: string;
}

export interface CommentThread {
  id: string;
  comments: ThesisComment[];
  section_id: string;
  created_at: string;
}

export type ThesisSectionType = 'frontMatter' | 'chapter' | 'backMatter';