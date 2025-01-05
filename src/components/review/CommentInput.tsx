import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Profile } from '@/types/profile';

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
}

export const CommentInput = ({ onSubmit }: CommentInputProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await onSubmit(newComment);
    setNewComment('');
  };

  return (
    <Card className="p-4">
      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add your comment..."
        className="mb-2"
      />
      <Button onClick={handleSubmit}>
        Submit Comment
      </Button>
    </Card>
  );
};