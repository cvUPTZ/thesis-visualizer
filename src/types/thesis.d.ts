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
  type: 'custom' | 'references' | 'table-of-contents';
  order: number;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references: Reference[];
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
  content: string;
  caption: string;
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
  created_at: string;
  updated_at: string;
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: string;
  type: 'book' | 'article' | 'website' | 'other';
  url?: string;
  doi?: string;
  created_at: string;
  updated_at: string;
}
