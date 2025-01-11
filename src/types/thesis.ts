export interface Collaborator {
  id: string;
  name: string;
  email: string;
  permissions: string[];
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
  startDate?: string;
  dueDate?: string;
}

export interface Thesis {
  id: string;
  title: string;
  abstract: string;
  introduction?: string;
  conclusion?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  ownerId: string;
  collaborators?: Collaborator[];
  contentOrder?: string[];
  language?: string;
  keywords?: string[];
  visibility: 'private' | 'public';
  version?: number;
  outline?: string;
  acknowledgements?: string;
  bibliography?: string;
  tableOfContents?: string;
  notes?: string[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  thesisId: string;
  order: number;
  sections: Section[];
  figures: Figure[]; // Added this line
}

export interface Section {
  id: string;
  title: string;
  content: string;
  chapterId: string;
  order: number;
  required?: boolean;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references?: Reference[];
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
  position?: 'left' | 'center' | 'right';
  customWidth?: number;
  customHeight?: number;
}

export interface Table {
  id: string;
  title: string;
  caption: string;
  content: string[][];
  thesisId: string;
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
