import React from 'react';
import { CommentThread as CommentThreadType } from '@/types/thesis';
import { Profile } from '@/types/profile';
import { CommentThread } from './CommentThread';

interface CommentListProps {
  comments: CommentThreadType[];
  currentUser: Profile | null;
  thesisId: string;
  sectionId: string;
}

export const CommentList = ({ 
  comments, 
  currentUser,
  thesisId,
  sectionId 
}: CommentListProps) => {
  return (
    <div className="space-y-6">
      {comments.map((thread) => (
        <CommentThread
          key={thread.comment.id}
          thread={thread}
          currentUser={currentUser}
          thesisId={thesisId}
          sectionId={sectionId}
        />
      ))}
    </div>
  );
};