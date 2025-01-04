import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ThesisComment } from '@/types/thesis';
import { formatDistanceToNow } from 'date-fns';

interface CommentThreadProps {
  thesisId: string;
  sectionId: string;
  comment: ThesisComment;
  replies: ThesisComment[];
  onReplyAdded: () => void;
}

export const CommentThread = ({ thesisId, sectionId, comment, replies, onReplyAdded }: CommentThreadProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { userId, userEmail } = useAuth();
  const { toast } = useToast();

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from('thesis_reviews')
        .insert({
          thesis_id: thesisId,
          section_id: sectionId,
          reviewer_id: userId,
          content: { text: replyContent },
          parent_id: comment.id,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });

      setReplyContent('');
      setIsReplying(false);
      onReplyAdded();
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-start gap-4 bg-muted/50 p-4 rounded-lg">
        <Avatar>
          <AvatarImage 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.user_id}`} 
            alt="User avatar" 
          />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{userEmail}</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>
        </div>
      </div>

      {replies.map((reply) => (
        <div key={reply.id} className="ml-8 flex items-start gap-4 bg-muted/30 p-4 rounded-lg">
          <Avatar>
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${reply.user_id}`} 
              alt="User avatar" 
            />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{userEmail}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm">{reply.content}</p>
          </div>
        </div>
      ))}

      {isReplying && (
        <div className="ml-8 space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleReply}>Post Reply</Button>
            <Button variant="outline" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};