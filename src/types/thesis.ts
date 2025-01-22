// Enums for type safety
export enum CitationType {
  BOOK = 'book',
  ARTICLE = 'article',
  CONFERENCE = 'conference',
  THESIS = 'thesis',
  WEBSITE = 'website',
  OTHER = 'other'
}

export enum SectionType {
  ABSTRACT = 'abstract',
  GENERAL_INTRODUCTION = 'general-introduction',
  INTRODUCTION = 'introduction',
  CHAPTER = 'chapter',
  CONCLUSION = 'conclusion',
  GENERAL_CONCLUSION = 'general-conclusion',
  REFERENCES = 'references',
  APPENDIX = 'appendix',
  TABLE_OF_CONTENTS = 'table-of-contents',
  ACKNOWLEDGMENTS = 'acknowledgments',
  CUSTOM = 'custom'
}

export enum ElementPosition {
  INLINE = 'inline',
  FLOAT_LEFT = 'float-left',
  FLOAT_RIGHT = 'float-right',
  CENTER = 'center'
}

// Base interface for common fields
interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Author information
export interface Author {
  firstName: string;
  lastName: string;
  email?: string;
  affiliation?: string;
  toString(): string;
}

// Structured content type
export interface StructuredContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Citation extends BaseEntity {
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
  title: string;
  container_title?: string;
  edition?: string;
  database?: string;
  specific_date?: string;
}

export interface Reference extends BaseEntity {
  text: string;
  title: string;
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
  specific_date?: string;
  container_title?: string;
  edition?: string;
}

export interface Figure extends BaseEntity {
  url: string;
  caption: string;
  alt_text: string;
  title: string;
  label: string;
  position: ElementPosition;
  dimensions: {
    width: number;
    height: number;
  };
  metadata?: {
    source?: string;
    copyright?: string;
    notes?: string;
  };
}

export interface TableCell {
  content: string;
  rowSpan?: number;
  colSpan?: number;
  header?: boolean;
}

export interface Table extends BaseEntity {
  title: string;
  caption: string;
  data: TableCell[][];
  metadata?: {
    source?: string;
    notes?: string;
  };
}

export interface Footnote extends BaseEntity {
  content: string;
  number: number;
  thesis_id: string;
  section_id: string;
}

export interface Section extends BaseEntity {
  title: string;
  content: string;
  type: SectionType;
  order: number;
  required: boolean;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references: Reference[];
  footnotes: Footnote[];
  metadata?: {
    keywords?: string[];
    abstract?: string;
    language?: string;
  };
}

export interface Chapter extends BaseEntity {
  title: string;
  content: string;
  sections: Section[];
  order: number;
  metadata?: {
    keywords?: string[];
    abstract?: string;
  };
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
  license?: string;
  fundingInformation?: string[];
}

export interface ThesisContent {
  metadata: ThesisMetadata;
  frontMatter: Section[];
  generalIntroduction?: Section;
  chapters: Chapter[];
  generalConclusion?: Section;
  backMatter: Section[];
}

export interface Thesis extends BaseEntity {
  title: string;
  content: ThesisContent;
  user_id: string;
  language: string;
  status: 'draft' | 'in_review' | 'published';
  version: string;
  permissions: {
    isPublic: boolean;
    allowComments: boolean;
    allowSharing: boolean;
  };
}

export interface ThesisVersion extends BaseEntity {
  thesis_id: string;
  content: ThesisContent;
  version_number: number;
  description?: string;
  created_by: string;
  changes: {
    type: 'addition' | 'deletion' | 'modification';
    path: string;
    description: string;
  }[];
}

export interface CommentThread extends BaseEntity {
  comments: Comment[];
  section_id: string;
  status: 'open' | 'resolved' | 'archived';
  metadata?: {
    context?: string;
    tags?: string[];
  };
}

export interface Comment extends BaseEntity {
  content: string;
  user_id: string;
  thread_id: string;
  parent_id?: string;
  edited?: boolean;
  reactions?: Record<string, string[]>;
}