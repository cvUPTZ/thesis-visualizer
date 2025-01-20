import React from 'react';
import { CommentThread } from '@/types/thesis';
import { Profile } from '@/types/profile';
import { CommentThread as CommentThreadComponent } from './CommentThread';

interface CommentListProps {
  comments: CommentThread[];
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
        <CommentThreadComponent
          key={thread.id}
          thread={thread}
          currentUser={currentUser}
          thesisId={thesisId}
          sectionId={sectionId}
        />
      ))}
    </div>
  );
};