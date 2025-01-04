import { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  email: string;
  role?: string;
}

export interface ThesisComment {
  id: string;
  content: Json;
  thesis_id: string;
  section_id: string;
  reviewer_id: string;
  parent_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: Profile;
}

export interface CommentThread {
  comment: ThesisComment;
  replies: ThesisComment[];
}

export interface CommentListProps {
  comments: CommentThread[];
  thesisId: string;
  sectionId: string;
  onReply: (commentId: string, replyContent: string) => Promise<void>;
  currentUser: Profile;
}