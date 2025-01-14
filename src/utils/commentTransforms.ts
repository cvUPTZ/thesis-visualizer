import { ThesisComment } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';

export const transformComment = (rawComment: any): ThesisComment => {
  return {
    id: rawComment.id,
    thesis_id: rawComment.thesis_id,
    section_id: rawComment.section_id,
    reviewer_id: rawComment.reviewer_id,
    content: rawComment.content?.text || '',
    parent_id: rawComment.parent_id,
    status: (rawComment.status === 'pending' || rawComment.status === 'resolved') 
      ? rawComment.status 
      : 'pending',
    created_at: rawComment.created_at,
    updated_at: rawComment.updated_at
  };
};