
import { CitationType, SectionType } from './enums';

export interface Author {
  firstName: string;
  lastName: string;
  email?: string;
  affiliation?: string;
  toString?: () => string;
}

export interface ThesisMetadata {
  description: string;
  keywords: string[];
  createdAt: string;
  universityName: string;
  departmentName: string;
  authors: Author[];
  supervisors: Author[];
  committeeMembers: Author[];
  thesisDate: string;
  language: string;
  version: string;
}

export interface Figure {
  id: string;
  url: string;
  caption: string;
  alt_text: string;
  title: string;
  label: string;
  dimensions: {
    width: number;
    height: number;
  };
  position: 'inline' | 'float-left' | 'float-right';
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  caption: string;
  data: any;
  content?: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Citation {
  id: string;
  reference_id: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  type: CitationType;
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
  title: string;
  authors: string[];
  year: string;
  type: string;
  url?: string;
  doi?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  text: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Footnote {
  id: string;
  text: string;
  content: string;
  thesis_id: string;
  section_id: string;
  number: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  thesis_id: string;
  title: string;
  content: string | StructuredContent[];
  type: SectionType;
  order: number;
  required: boolean;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references: Reference[];
  footnotes: Footnote[];
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  sections: Section[];
  order: number;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references: Reference[];
  created_at: string;
  updated_at: string;
}

export interface ThesisContent {
  metadata: ThesisMetadata;
  frontMatter: Section[];
  generalIntroduction: Section;
  chapters: Chapter[];
  generalConclusion: Section;
  backMatter: Section[];
}

export interface Thesis {
  id: string;
  title: string;
  content: ThesisContent;
  user_id: string;
  created_at: string;
  updated_at: string;
  language: string;
  status: 'draft' | 'in_review' | 'published';
  version?: string;
  permissions?: {
    isPublic: boolean;
    allowComments: boolean;
    allowSharing: boolean;
  };
  description?: string;
  supervisor_email?: string;
  supervisor_id?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  content: string;
  user_id: string;
  created_at: string;
}

export interface CommentThread {
  id: string;
  comments: Comment[];
  section_id: string;
  created_at: string;
}

export interface ThesisVersion {
  id: string;
  thesis_id: string;
  content: ThesisContent;
  version_number: number;
  created_at: string;
  created_by: string;
  description?: string;
  language: string;
  version?: string;
  changes?: any[];
}

export type StructuredContent = {
  type: string;
  content: string;
}[];

export type ThesisSectionType = SectionType;

// Re-export the enums
export { CitationType, SectionType };
