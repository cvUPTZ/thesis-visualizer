import React from 'react';
import { CommentThread } from '@/types/thesis';
import { Profile } from '@/types/profile';
import { CommentThread as CommentThreadComponent } from './CommentThread';

interface CommentListProps {
  comments: CommentThread[];
  onReply: (commentId: string, content: string) => void;
  currentUser: Profile | null;
}

export const CommentList = ({ comments, onReply, currentUser }: CommentListProps) => {
  return (
    <div className="space-y-6">
      {comments.map((thread) => (
        <CommentThreadComponent
          key={thread.comment.id}
          comment={thread.comment}
          replies={thread.replies}
          onReply={onReply}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};