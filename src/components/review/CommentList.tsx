import React from 'react';
import { CommentThread as CommentThreadType } from '@/types/thesis';
import { Profile } from '@/types/profile';
import { CommentThread } from './CommentThread';

interface CommentListProps {
  comments: CommentThreadType[];
  onReply: (commentId: string, content: string) => void;
  currentUser: Profile | null;
  thesisId: string;
  sectionId: string;
}

export const CommentList = ({ 
  comments, 
  onReply, 
  currentUser,
  thesisId,
  sectionId 
}: CommentListProps) => {
  return (
    <div className="space-y-6">
      {comments.map((thread) => (
        <CommentThread
          key={thread.comment.id}
          comment={thread.comment}
          replies={thread.replies}
          onReply={onReply}
          currentUser={currentUser}
          thesisId={thesisId}
          sectionId={sectionId}
          onReplyAdded={() => {}}
        />
      ))}
    </div>
  );
};