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
