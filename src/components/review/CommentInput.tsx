import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
}

export const CommentInput: React.FC<CommentInputProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(content);
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Comment
        </Button>
      </div>
    </div>
  );
};