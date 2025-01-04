import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';
import { ThesisComment, CommentThread } from '@/types/thesis';
import { CommentList } from './CommentList';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ReviewerInterfaceProps {
  thesisId: string;
  sectionId: string;
}

export const ReviewerInterface = ({ thesisId, sectionId }: ReviewerInterfaceProps) => {
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const transformComment = (rawComment: any): ThesisComment => {
    return {
      id: rawComment.id,
      thesis_id: rawComment.thesis_id,
      section_id: rawComment.section_id,
      reviewer_id: rawComment.reviewer_id,
      content: { 
        text: typeof rawComment.content === 'string' 
          ? rawComment.content 
          : rawComment.content.text || '' 
      },
      parent_id: rawComment.parent_id,
      status: rawComment.status as 'pending' | 'resolved',
      created_at: rawComment.created_at,
      updated_at: rawComment.updated_at
    };
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log('Fetching comments for thesis:', thesisId, 'section:', sectionId);
        const { data: commentsData, error: commentsError } = await supabase
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

        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
          throw commentsError;
        }

        console.log('Fetched comments:', commentsData);
        
        // Transform the flat comments into a thread structure using the transformed comments
        const threadMap = new Map<string | null, ThesisComment[]>();
        commentsData.forEach((comment: any) => {
          const transformedComment = transformComment(comment);
          const parentId = comment.parent_id || null;
          if (!threadMap.has(parentId)) {
            threadMap.set(parentId, []);
          }
          threadMap.get(parentId)?.push(transformedComment);
        });

        // Create thread objects
        const threads: CommentThread[] = (threadMap.get(null) || []).map(comment => ({
          comment,
          replies: threadMap.get(comment.id) || []
        }));

        setComments(threads);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            roles (
              name
            )
          `)
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        console.log('Fetched profile:', profileData);
        setProfile(profileData);
      } catch (error) {
        console.error('Error in fetchComments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [thesisId, sectionId, toast]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log('Submitting new comment');
      const { data, error } = await supabase
        .from('thesis_reviews')
        .insert([
          {
            thesis_id: thesisId,
            section_id: sectionId,
            reviewer_id: profile?.id,
            content: { text: newComment },
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

      console.log('New comment submitted:', data);
      
      // Add the new comment as a new thread
      const newThread: CommentThread = {
        comment: {
          ...data,
          content: { text: data.content.text || '' }
        },
        replies: []
      };
      
      setComments([...comments, newThread]);
      setNewComment('');
      
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

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <CommentList 
        comments={comments}
        currentUser={profile}
        thesisId={thesisId}
        sectionId={sectionId}
      />
      <Card className="p-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          className="mb-2"
        />
        <Button onClick={handleSubmitComment}>
          Submit Comment
        </Button>
      </Card>
    </div>
  );
};
