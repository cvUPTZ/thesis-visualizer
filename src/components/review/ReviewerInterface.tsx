import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommentList } from './CommentList';
import { ErrorState } from '@/components/error/ErrorState';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import type { ThesisComment, CommentThread, Profile } from '@/types/thesis';

export const ReviewerInterface = ({ 
  thesisId, 
  sectionId,
  currentUser 
}: { 
  thesisId: string;
  sectionId: string;
  currentUser: Profile;
}) => {
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [thesisId, sectionId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data: commentsData, error: commentsError } = await supabase
        .from('thesis_reviews')
        .select(`
          *,
          profiles (
            id,
            email,
            role
          )
        `)
        .eq('thesis_id', thesisId)
        .eq('section_id', sectionId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Group comments into threads
      const threads = commentsData
        .filter(comment => !comment.parent_id)
        .map(comment => ({
          comment: {
            ...comment,
            profiles: comment.profiles as Profile
          } as ThesisComment,
          replies: commentsData
            .filter(reply => reply.parent_id === comment.id)
            .map(reply => ({
              ...reply,
              profiles: reply.profiles as Profile
            })) as ThesisComment[]
        }));

      setComments(threads);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentId: string, replyContent: string) => {
    try {
      const { data: newComment, error: insertError } = await supabase
        .from('thesis_reviews')
        .insert({
          thesis_id: thesisId,
          section_id: sectionId,
          reviewer_id: currentUser.id,
          parent_id: commentId,
          content: { text: replyContent },
          status: 'active'
        })
        .select(`
          *,
          profiles (
            id,
            email,
            role
          )
        `)
        .single();

      if (insertError) throw insertError;

      // Update the comments state
      setComments(prevComments => 
        prevComments.map(thread => {
          if (thread.comment.id === commentId) {
            return {
              ...thread,
              replies: [...thread.replies, {
                ...newComment,
                profiles: newComment.profiles as Profile
              } as ThesisComment]
            };
          }
          return thread;
        })
      );

      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
    } catch (err: any) {
      console.error('Error adding reply:', err);
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={fetchComments} />;

  return (
    <CommentList
      comments={comments}
      thesisId={thesisId}
      sectionId={sectionId}
      onReply={handleReply}
      currentUser={currentUser}
    />
  );
};