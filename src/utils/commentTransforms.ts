import { Comment, ThesisComment } from '@/types/components';

export const transformComment = (comment: ThesisComment): Comment => {
  return {
    id: comment.id,
    content: typeof comment.content === 'string' 
      ? { text: comment.content }
      : comment.content,
    reviewer_id: comment.reviewer_id,
    created_at: comment.created_at
  };
};