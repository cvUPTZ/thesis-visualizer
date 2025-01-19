import React, { useState } from 'react';
import { Profile } from '@/types/profile';
import type { CommentThread as CommentThreadType } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommentThreadProps {
  thread: CommentThreadType;
  currentUser: Profile | null;
  thesisId: string;
  sectionId: string;
}

export const CommentThread = ({
  thread,
  currentUser,
  thesisId,
  sectionId
}: CommentThreadProps) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { toast } = useToast();

  const getCommentContent = (content: string | { text: string }) => {
    return typeof content === 'string' ? content : content.text;
  };

  const handleReply = async () => {
    if (!currentUser || !replyContent.trim()) return;

    try {
      const { data, error } = await supabase
        .from('thesis_reviews')
        .insert({
          thesis_id: thesisId,
          section_id: sectionId,
          reviewer_id: currentUser.id,
          content: { text: replyContent },
          parent_id: thread.comment.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });

      setReplyContent('');
      setShowReplyForm(false);
    } catch (error: any) {
      console.error('Error adding reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarFallback>
              {thread.comment.reviewer_id.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="prose prose-sm">
              <p>{getCommentContent(thread.comment.content)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </Button>
          </div>
        </div>
      </Card>

      {thread.replies.map((reply) => (
        <Card key={reply.id} className="p-4 ml-8">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarFallback>
                {reply.reviewer_id.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 prose prose-sm">
              <p>{getCommentContent(reply.content)}</p>
            </div>
          </div>
        </Card>
      ))}

      {showReplyForm && (
        <div className="ml-8 space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowReplyForm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReply}>
              Post Reply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};