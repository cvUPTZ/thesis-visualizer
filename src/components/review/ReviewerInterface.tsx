import React, { useState } from 'react';
import { Comment } from '@/types/thesis';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ReviewerInterfaceProps {
  thesisId: string;
  sectionId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'created_at'>) => void;
}

export const ReviewerInterface: React.FC<ReviewerInterfaceProps> = ({
  thesisId,
  sectionId,
  comments,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onAddComment({
      reviewer_id: 'current-user',
      content: newComment.trim()
    });

    setNewComment('');
    
    toast({
      title: "Success",
      description: "Comment added successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="comments-list space-y-4">
        {comments.map((comment) => (
          <div 
            key={comment.id} 
            className="p-4 bg-background rounded-lg border"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">
                {comment.reviewer_id}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          className="min-h-[100px]"
        />
        <Button type="submit">
          Add Comment
        </Button>
      </form>
    </div>
  );
};