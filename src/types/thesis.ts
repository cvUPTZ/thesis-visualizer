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
  content?: any;
  metadata: ThesisMetadata;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  content?: string;
  order: number;
  sections: Section[];
  figures: Figure[];
  tasks: {
      id: string;
      description: string;
      status: 'pending' | 'in progress' | 'completed' | 'on hold';
      dueDate?: string;
      priority: 'high' | 'medium' | 'low';
   }[]
}

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
  tasks: {
    id: string;
    description: string;
    status: 'pending' | 'in progress' | 'completed' | 'on hold';
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

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
  title: string;
  caption?: string;
  content: string;
}

export interface Citation {
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

export interface Reference {
  id: string;
  title: string;
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
