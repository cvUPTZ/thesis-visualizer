import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';
import { CommentThread } from './CommentThread';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ReviewerInterface = () => {
  const { thesisId } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'suggestion' | 'correction'>('comment');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('thesis_reviews')
        .select(`
          *,
          profiles (
            email
          )
        `)
        .eq('thesis_id', thesisId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch reviews',
          variant: 'destructive',
        });
        return;
      }

      setReviews(data);
    };

    fetchReviews();

    // Set up real-time subscription
    const channel = supabase
      .channel('thesis_reviews')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'thesis_reviews',
          filter: `thesis_id=eq.${thesisId}`,
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [thesisId, toast]);

  const addReview = async () => {
    if (!newComment.trim() || !activeSection) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add reviews',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('thesis_reviews').insert([
      {
        thesis_id: thesisId,
        reviewer_id: user.id,
        section_id: activeSection,
        content: {
          text: newComment,
          type: commentType
        },
        status: 'pending'
      }
    ]);

    if (error) {
      console.error('Error adding review:', error);
      toast({
        title: 'Error',
        description: 'Failed to add review',
        variant: 'destructive',
      });
      return;
    }

    setNewComment('');
    toast({
      title: 'Success',
      description: 'Review added successfully',
    });
  };

  const handleReplyAdded = async (commentId: string, replyContent: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('thesis_reviews').insert([
      {
        thesis_id: thesisId,
        reviewer_id: user.id,
        section_id: activeSection!,
        parent_id: commentId,
        content: {
          text: replyContent,
          type: 'reply'
        },
        status: 'pending'
      }
    ]);

    if (error) {
      console.error('Error adding reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reply',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Review Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {reviews.map((review) => (
              <CommentThread
                key={review.id}
                thesisId={thesisId!}
                sectionId={review.section_id}
                comment={review}
                replies={reviews.filter(r => r.parent_id === review.id)}
                onReplyAdded={handleReplyAdded}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 space-y-4">
          <Select
            value={commentType}
            onValueChange={(value: 'comment' | 'suggestion' | 'correction') => setCommentType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Comment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comment">Comment</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
              <SelectItem value="correction">Correction</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your review comment..."
            className="min-h-[100px]"
          />
          <Button
            onClick={addReview}
            className="w-full"
            disabled={!newComment.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Add Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};