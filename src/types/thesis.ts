export interface ThesisComment {
  id: string;
  thesis_id: string;
  section_id: string;
  reviewer_id: string;
  content: {
    text: string;
  };
  parent_id?: string;
  status: 'pending' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface CommentThread {
  comment: ThesisComment;
  replies: ThesisComment[];
}

export interface Thesis {
  id: string;
  title: string;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  createdAt: string;
  updatedAt: string;
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
  order: number;
}
