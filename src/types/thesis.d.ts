export interface Thesis {
  id: string;
  title: string;
  content: ThesisContent;
  user_id: string;
  created_at: string;
  updated_at: string;
  language: string;
  supervisor_email?: string;
  supervisor_id?: string;
  version?: string;
  status?: 'draft' | 'in_review' | 'published';
  permissions?: {
    isPublic: boolean;
    allowComments: boolean;
    allowSharing: boolean;
  };
  description?: string;
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
  thesis_id: string;
  order: number;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface Section {
  id: string;
  thesis_id: string;
  title: string;
  content: string | StructuredContent[];
  type: SectionType;
  required: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references: Reference[];
  footnotes: Footnote[];
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
