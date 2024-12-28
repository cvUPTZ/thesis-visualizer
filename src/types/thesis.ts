export interface Citation {
  id: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  type: 'book' | 'article' | 'conference' | 'website' | 'other';
}

export interface Figure {
  id: string;
  caption: string;
  imageUrl: string;
  altText: string;
  number: number;
}

export interface Table {
  id: string;
  caption: string;
  headers: string[];
  rows: string[][];
  number: number;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  type: 
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
    | 'custom';
  required?: boolean;
  order: number;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  sections: Section[];
}

export interface Thesis {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
}