export interface Thesis {
  id: string;
  title: string;
  generalIntroduction?: Section;
  generalConclusion?: Section;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
  thesis_id: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  type: string;
  required?: boolean;
  order?: number;
  status?: 'draft' | 'in_review' | 'published';
  created_at?: string;
  updated_at?: string;
  figures?: Figure[];
  tables?: Table[];
  citations?: Citation[];
  references?: Reference[];
  footnotes?: Footnote[];
}

export interface Footnote {
  id: string;
  text: string;
}

export interface CommentThread {
  id: string;
  comments: Comment[];
  section_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  created_at: string;
}

export interface Figure {
  id: string;
  caption: string;
  url: string;
}

export interface Table {
  id: string;
  caption: string;
  data: any;
}

export interface Citation {
  id: string;
  reference_id: string;
  text: string;
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: string;
  type: string;
  url?: string;
}
