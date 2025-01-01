import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNotification } from '@/contexts/NotificationContext';
import { MessageSquare, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ReviewPanelProps {
  thesisId: string;
}

export const ReviewPanel = ({ thesisId }: ReviewPanelProps) => {
  const { toast } = useNotification();
  const [feedback, setFeedback] = React.useState('');

  const { data: reviews, isLoading, error } = useQuery({
      queryKey: ['thesis-reviews', thesisId],
        queryFn: async () => {
            console.log('Fetching reviews for thesis:', thesisId);
          try {
            const { data, error } = await supabase
                .from('thesis_reviews')
                .select(`
                    id,
                   content,
                   status,
                    created_at,
                    reviewer_id,
                    profiles:reviewer_id (email)
               `)
                .eq('thesis_id', thesisId)
                .order('created_at', { ascending: false });
                if (error) {
                  console.error('Error fetching reviews:', error);
                    throw new Error(error.message);
                }
                return data;
            } catch (error: any) {
                console.error('Error in useQuery:', error);
                toast({
                    title: "Error",
                  description: error.message || "Failed to fetch reviews. Please try again.",
                   variant: "destructive",
                });
                throw error;
           }
      },
  });

    const submitReview = async () => {
        try {
            // Get current user's ID
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) {
                throw new Error('No authenticated user found');
           }
            const { data: existingReview } = await supabase
                .from('thesis_reviews')
                .select('id')
               .eq('thesis_id', thesisId)
                .eq('reviewer_id', session.user.id)
                .maybeSingle();

          if (existingReview) {
               const { error: updateError } = await supabase
                  .from('thesis_reviews')
                    .update({
                       content: { feedback },
                        status: 'completed',
                    })
                    .eq('id', existingReview.id);

              if (updateError) throw new Error(updateError.message);
            } else {
               const { error: insertError } = await supabase
                  .from('thesis_reviews')
                    .insert({
                        thesis_id: thesisId,
                        reviewer_id: session.user.id,
                        content: { feedback },
                        status: 'completed',
                    });

                if (insertError) throw new Error(insertError.message);
            }
           toast({
               title: "Review submitted",
                description: "Your feedback has been saved successfully.",
            });
          setFeedback('');
      } catch (error: any) {
            console.error('Error submitting review:', error);
            toast({
                title: "Error",
                description: "Failed to submit review. Please try again.",
              variant: "destructive",
          });
       }
   };
    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Thesis Review</h3>
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-4">
                <Textarea
                    placeholder="Enter your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                   className="min-h-[200px]"
                />
                <Button
                   onClick={submitReview}
                    className="w-full"
                    disabled={!feedback.trim()}
                >
                    Submit Review
               </Button>
            </div>

           <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                   <h4 className="font-medium">Previous Reviews</h4>
                    {isLoading ? (
                       <p className="text-sm text-muted-foreground">Loading reviews...</p>
                    ) : reviews?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No reviews yet</p>
                    ) : (
                      reviews?.map((review: any) => (
                          <div
                              key={review.id}
                              className="rounded-lg border p-3 space-y-2"
                            >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                   {review.profiles.email}
                                </span>
                                <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
                                  {review.status}
                              </Badge>
                         </div>
                          <p className="text-sm text-muted-foreground">
                                {review.content.feedback}
                           </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                    )}
                </div>
            </ScrollArea>
       </div>
    );
};