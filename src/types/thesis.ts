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
  author_last_names: string[];
  author_first_initials: string[];
  author_middle_initials: string[];
  title: string;
  container_title?: string;
  edition?: string;
  database?: string;
  specific_date?: string;
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

export interface Figure {
  id: string;
  imageUrl: string;
  caption: string;
  altText: string;
  title: string;
  number: number;
  dimensions: {
    width: number;
    height: number;
  };
  alt_text?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Table {
  id: string;
  title: string;
  caption: string;
  content: string;
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
  thesis_id: string;
  section_id: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  type?: string;
  order?: number;
  required?: boolean;
  figures?: Figure[];
  tables?: Table[];
  citations?: Citation[];
  references?: Reference[];
  footnotes?: Footnote[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  sections: Section[];
  order?: number;
  figures?: Figure[];
  tables?: Table[];
  footnotes?: Footnote[];
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
  language?: string;
  supervisor_email?: string;
  supervisor_id?: string;
}

export interface ThesisVersion {
  id: string;
  thesis_id: string;
  content: any;
  version_number: number;
  description?: string;
  created_at: string;
  created_by: string;
  language?: string;
}

export interface CommentThread {
  id: string;
  comments: Comment[];
  section_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export type ReferenceStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard';
export type ThesisSectionType = 'frontMatter' | 'chapter' | 'backMatter';