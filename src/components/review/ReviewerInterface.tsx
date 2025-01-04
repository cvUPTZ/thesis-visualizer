import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';

interface ThesisReview {
  id: string;
  content: {
    text: string;
    type: 'comment' | 'suggestion' | 'correction';
  };
  reviewer_id: string;
  created_at: string;
  status: string;
  profiles?: {
    email: string;
  };
}

export const ReviewerInterface = () => {
  const { thesisId } = useParams<{ thesisId: string }>();
  const [reviews, setReviews] = useState<ThesisReview[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('thesis_reviews')
        .select(`
          id,
          content,
          reviewer_id,
          created_at,
          status,
          profiles (
            email
          )
        `)
        .eq('thesis_id', thesisId);

      if (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch reviews',
          variant: 'destructive',
        });
        return;
      }

      console.log('Fetched reviews:', data);
      setReviews(data || []);
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
        content: {
          text: newComment,
          type: 'comment'
        },
        reviewer_id: user.id,
        section_id: activeSection,
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
              <Card key={review.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">
                    {review.profiles?.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{review.content.text}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {review.content.type}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
                    {review.status}
                  </span>
                </div>
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
            onClick={addReview}
            className="mt-2 w-full"
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