import { ThesisComment } from '@/types/thesis';

export const transformComment = (rawComment: any): ThesisComment => {
  return {
    id: rawComment.id,
    content: typeof rawComment.content === 'string' ? rawComment.content : rawComment.content?.text || '',
    reviewer_id: rawComment.reviewer_id,
    status: (rawComment.status === 'pending' || rawComment.status === 'resolved') 
      ? rawComment.status 
      : 'pending',
    created_at: rawComment.created_at,
    updated_at: rawComment.updated_at,
    section_id: rawComment.section_id,
    parent_id: rawComment.parent_id
  };
};