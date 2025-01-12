import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommentList } from './CommentList';
import { CommentInput } from './CommentInput';
import { Badge } from '@/components/ui/badge';
import { Check, MessageSquare, AlertCircle } from 'lucide-react';

interface ReviewInterfaceProps {
  thesisId: string;
  sectionId: string;
}

export const ReviewInterface: React.FC<ReviewInterfaceProps> = ({
  thesisId,
  sectionId,
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [thesisId, sectionId]);

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for thesis:', thesisId, 'section:', sectionId);
      const { data, error } = await supabase
        .from('thesis_reviews')
        .select(`
          *,
          profiles (
            email,
            roles (
              name
            )
          )
        `)
        .eq('thesis_id', thesisId)
        .eq('section_id', sectionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('Fetched comments:', data);
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (content: string) => {
    try {
      console.log('Submitting new comment');
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('thesis_reviews')
        .insert([
          {
            thesis_id: thesisId,
            section_id: sectionId,
            reviewer_id: userData.user.id,
            content: { text: content },
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('New comment submitted:', data);
      setComments(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Review Comments</h3>
        <Badge variant="outline" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          {comments.length} Comments
        </Badge>
      </div>

      <Tabs defaultValue="comments">
        <TabsList>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="comments">
          <ScrollArea className="h-[400px] pr-4">
            <CommentList 
              comments={comments.filter(c => c.status === 'pending')}
              currentUser={null}
              thesisId={thesisId}
              sectionId={sectionId}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="resolved">
          <ScrollArea className="h-[400px] pr-4">
            <CommentList 
              comments={comments.filter(c => c.status === 'resolved')}
              currentUser={null}
              thesisId={thesisId}
              sectionId={sectionId}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <CommentInput onSubmit={handleSubmitComment} />
    </Card>
  );
};