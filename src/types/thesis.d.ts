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
  content: string;
  reviewer_id: string;
  created_at: string;
}

export interface CommentThread {
  id: string;
  content: string;
  author: string;
  created_at: string;
  comment: Comment;
  replies: Comment[];
}
