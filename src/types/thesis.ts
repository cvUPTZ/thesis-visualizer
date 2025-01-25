export enum CitationType {
  BOOK = 'book',
  ARTICLE = 'article',
  CONFERENCE = 'conference',
  WEBSITE = 'website',
  OTHER = 'other'
}

export enum SectionType {
  ABSTRACT = 'abstract',
  GENERAL_INTRODUCTION = 'general_introduction',
  INTRODUCTION = 'introduction',
  CHAPTER = 'chapter',
  CONCLUSION = 'conclusion',
  GENERAL_CONCLUSION = 'general_conclusion',
  REFERENCES = 'references',
  APPENDIX = 'appendix',
  TABLE_OF_CONTENTS = 'table_of_contents',
  ACKNOWLEDGMENTS = 'acknowledgments',
  CUSTOM = 'custom',
  TITLE = 'title'
}

export interface Figure {
  id: string;
  url: string;
  caption: string;
  alt_text: string;
  title: string;
  label: string;
  position: string;
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

export interface Author {
  firstName: string;
  lastName: string;
  email?: string;
  affiliation?: string;
  toString(): string;
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

export interface StructuredContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Section {
  id: string;
  title: string;
  content: string | StructuredContent[];
  type: SectionType;
  order: number;
  required: boolean;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references: Reference[];
  footnotes?: Footnote[];
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
  generalIntroduction?: Section;
  chapters: Chapter[];
  generalConclusion?: Section;
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
  version: string;
  permissions: {
    isPublic: boolean;
    allowComments: boolean;
    allowSharing: boolean;
  };
  description?: string;
  supervisor_email?: string;
  supervisor_id?: string;
}
