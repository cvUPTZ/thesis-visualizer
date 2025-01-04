export interface Thesis {
  id: string;
  title: string;
  content: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ThesisComment {
  id: string;
  content: string;
  user_id: string;
  parent_id?: string;
  created_at: string;
  thesis_id: string;
}

export interface CommentThread {
  comment: ThesisComment;
  replies: ThesisComment[];
}