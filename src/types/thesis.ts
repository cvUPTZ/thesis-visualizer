export interface Thesis {
  id: string;
  metadata: {
    description: string;
    keywords: string[];
    createdAt: string;
    universityName?: string;
    departmentName?: string;
    authorName?: string;
    thesisDate?: string;
    committeeMembers?: string[];
    language?: 'en' | 'fr';
  };
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
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

export interface Table {
  id: string;
  caption?: string;
  content: string;
  title?: string;
}

export interface Figure {
  id: string;
  caption?: string;
  imageUrl: string;
  altText: string;
  number: number;
  dimensions?: {
    width: number;
    height: number;
  };
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
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
}

export type ThesisSectionType = 
  | 'title'
  | 'abstract'
  | 'acknowledgments'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'list-of-tables'
  | 'introduction'
  | 'literature-review'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'recommendations'
  | 'references'
  | 'appendix'
  | 'custom'
  | 'preface'
  | 'abbreviations'
  | 'glossary'
  | 'theoretical-framework'
  | 'empirical-study'
  | 'postface'
  | 'advice';