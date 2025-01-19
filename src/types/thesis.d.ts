export interface Chapter {
  id: string;
  title: string;
  content: string;
  sections: Section[];
  part: number;
  order: number;
  figures: Figure[];
  tables: Table[];
  footnotes: Footnote[];
}

export type ThesisSectionType = 
  | 'title'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'list-of-tables'
  | 'acknowledgments'
  | 'abstract'
  | 'list-of-abbreviations'
  | 'general-introduction'
  | 'introduction'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'general-conclusion'
  | 'bibliography'
  | 'appendix'
  | 'custom'
  | 'references'
  | 'chapter';

export interface Comment {
  id: string;
  content: string | { text: string };
  reviewer_id: string;
  created_at: string;
  profiles?: {
    email: string;
    roles: {
      name: string;
    };
  };
}

export interface CommentThread {
  id: string;
  content: string | { text: string };
  author: string;
  created_at: string;
  comment: Comment;
  replies: Comment[];
}
