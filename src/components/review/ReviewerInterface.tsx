import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';
import { CommentThread } from '@/types/thesis';
import { CommentList } from './CommentList';
import { CommentInput } from './CommentInput';
import { transformComment } from '@/utils/commentTransforms';

interface ReviewerInterfaceProps {
  thesisId: string;
  sectionId: string;
}

export const ReviewerInterface = ({ thesisId, sectionId }: ReviewerInterfaceProps) => {
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: commentsData, error: commentsError } = await (supabase
          .from('thesis_reviews' as any) as any)
          .select('*')
          .eq('thesis_id', thesisId)
          .eq('section_id', sectionId)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        const threads: CommentThread[] = (commentsData || []).map((comment: any) => ({
          id: comment.id,
          comments: [transformComment(comment)],
          section_id: comment.section_id,
          created_at: comment.created_at
        }));

        setComments(threads);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profileError) throw profileError;

        setProfile(profileData as any as Profile);
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

    fetchComments();
  }, [thesisId, sectionId, toast]);

  const handleSubmitComment = async (content: string) => {
    try {
      const { data, error } = await (supabase.from('thesis_reviews' as any) as any)
        .insert([{
          thesis_id: thesisId,
          section_id: sectionId,
          reviewer_id: profile?.id,
          content: { text: content },
          status: 'pending'
        }])
        .select('*')
        .single();

      if (error) throw error;

      const newThread: CommentThread = {
        id: data.id,
        comments: [transformComment(data)],
        section_id: data.section_id,
        created_at: data.created_at
      };
      
      setComments([...comments, newThread]);
      
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

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="space-y-4">
      <CommentList 
        comments={comments}
        currentUser={profile}
        thesisId={thesisId}
        sectionId={sectionId}
      />
      <CommentInput onSubmit={handleSubmitComment} />
    </div>
  );
};
