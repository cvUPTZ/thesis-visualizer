import { Comment } from '@/types/thesis';

interface ThesisComment {
  id: string;
  content: { text: string } | string;
  reviewer_id: string;
  created_at: string;
}

export const transformComment = (comment: ThesisComment): Comment => {
  return {
    id: comment.id,
    content: typeof comment.content === 'string' 
      ? comment.content 
      : comment.content.text,
    reviewer_id: comment.reviewer_id,
    created_at: comment.created_at
  };
};