import React, { useState } from 'react';
import { ThesisComment } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface CommentThreadProps {
  comment: ThesisComment;
  replies: ThesisComment[];
  onReplyAdded: (reply: ThesisComment) => void;
}

export const CommentThread = ({ comment, replies, onReplyAdded }: CommentThreadProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('thesis_reviews')
        .insert([
          {
            thesis_id: comment.thesis_id,
            section_id: comment.section_id,
            reviewer_id: userId,
            content: replyContent,
            parent_id: comment.id,
            status: 'pending'
          }
        ])
        .select(`
          *,
          profiles (
            email,
            roles (
              name
            )
          )
        `)
        .single();

      if (error) throw error;

      onReplyAdded(data);
      setReplyContent('');
      setIsReplying(false);
      
      toast({
        title: "Success",
        description: "Reply added successfully",
      });
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Error",
        description: "Failed to submit reply",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium">{comment.profiles?.email}</div>
          <div className="text-sm text-gray-500">{formatDate(comment.created_at)}</div>
        </div>
        <div className="text-gray-700 mb-2">{comment.content?.toString()}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
        >
          Reply
        </Button>
      </Card>

      {replies.map((reply) => (
        <Card key={reply.id} className="ml-8 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">{reply.profiles?.email}</div>
            <div className="text-sm text-gray-500">{formatDate(reply.created_at)}</div>
          </div>
          <div className="text-gray-700">{reply.content?.toString()}</div>
        </Card>
      ))}

      {isReplying && (
        <div className="ml-8 space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
          />
          <div className="flex space-x-2">
            <Button onClick={handleSubmitReply}>
              Submit Reply
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsReplying(false);
                setReplyContent('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};