import { Comment } from '@/types/thesis';

export const transformComment = (rawComment: any): Comment => {
  return {
    id: rawComment.id,
    content: { 
      text: typeof rawComment.content === 'string' 
        ? rawComment.content 
        : typeof rawComment.content === 'object' && rawComment.content !== null
          ? String(rawComment.content.text || '')
          : ''
    },
    user_id: rawComment.reviewer_id,
    created_at: rawComment.created_at
  };
};