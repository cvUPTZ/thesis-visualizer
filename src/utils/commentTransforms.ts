import { Comment, ThesisComment } from '@/types/components';

export const transformComment = (comment: ThesisComment): Comment => {
  return {
    id: comment.id,
    content: typeof comment.content === 'string' ? comment.content : comment.content.text,
    author: comment.author,
    created_at: comment.created_at,
    reviewer_id: comment.reviewer_id
  };
};