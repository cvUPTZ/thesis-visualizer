import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  section_id: string;
  reviewer_id: string;
  created_at: string;
  reviewer_email?: string;
}

export const ReviewerInterface = () => {
  const { thesisId } = useParams<{ thesisId: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('thesis_reviews')
        .select(`
          id,
          content,
          reviewer_id,
          created_at,
          profiles (email)
        `)
        .eq('thesis_id', thesisId);

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data || []);
    };

    fetchComments();

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
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [thesisId]);

  const addComment = async () => {
    if (!newComment.trim() || !activeSection) return;

    const { error } = await supabase.from('thesis_reviews').insert([
      {
        thesis_id: thesisId,
        content: newComment,
        section_id: activeSection,
      },
    ]);

    if (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
      return;
    }

    setNewComment('');
    toast({
      title: 'Success',
      description: 'Comment added successfully',
    });
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
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">
                    {comment.reviewer_email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your review comment..."
            className="min-h-[100px]"
          />
          <Button
            onClick={addComment}
            className="mt-2 w-full"
            disabled={!newComment.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Add Comment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};