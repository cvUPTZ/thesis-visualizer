import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useThesisData } from '@/hooks/useThesisData';
import { CommentThread, ThesisComment } from '@/types/thesis';
import { Profile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CommentList } from './CommentList';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';
import { ErrorState } from '@/components/error/ErrorState';

export const ReviewerInterface = () => {
  const { thesisId } = useParams();
  const { thesis, isLoading, error } = useThesisData(thesisId);
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [reviewer, setReviewer] = useState<Profile | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviewer = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching reviewer profile:', profileError);
        return;
      }

      setReviewer(profile);
    };

    fetchReviewer();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!thesis || !activeSection) return;

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
        .eq('thesis_id', thesis.id)
        .eq('section_id', activeSection)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        return;
      }

      const { data: repliesData, error: repliesError } = await supabase
        .from('thesis_reviews')
        .select(`
          *,
          profiles (
            id,
            email,
            role
          )
        `)
        .eq('thesis_id', thesis.id)
        .not('parent_id', 'is', null)
        .order('created_at', { ascending: true });

      if (repliesError) {
        console.error('Error fetching replies:', repliesError);
        return;
      }

      const commentThreads = commentsData.map((comment: ThesisComment) => ({
        comment,
        replies: repliesData.filter((reply: ThesisComment) => reply.parent_id === comment.id)
      }));

      setComments(commentThreads);
    };

    fetchComments();
  }, [thesis, activeSection]);

  const handleReply = async (commentId: string, replyContent: string) => {
    if (!thesis || !reviewer) return;

    try {
      const { data: newReply, error: replyError } = await supabase
        .from('thesis_reviews')
        .insert({
          thesis_id: thesis.id,
          reviewer_id: reviewer.id,
          content: { text: replyContent },
          parent_id: commentId,
          section_id: activeSection,
          status: 'pending'
        })
        .select()
        .single();

      if (replyError) throw replyError;

      setComments(prevComments => {
        const updatedComments = [...prevComments];
        const parentComment = updatedComments.find(c => c.comment.id === commentId);
        if (parentComment) {
          parentComment.replies = [...(parentComment.replies || []), newReply];
        }
        return updatedComments;
      });

      toast({
        title: "Reply Added",
        description: "Your reply has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!thesis || !reviewer || !newComment.trim()) return;

    try {
      const { data: comment, error: commentError } = await supabase
        .from('thesis_reviews')
        .insert({
          thesis_id: thesis.id,
          reviewer_id: reviewer.id,
          content: { text: newComment },
          section_id: activeSection,
          status: 'pending'
        })
        .select()
        .single();

      if (commentError) throw commentError;

      setComments(prevComments => [...prevComments, { comment, replies: [] }]);
      setNewComment('');

      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !thesis) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px]"
        />
        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
          Add Comment
        </Button>
      </div>

      <CommentList
        comments={comments}
        onReply={handleReply}
        currentUser={reviewer}
      />
    </div>
  );
};