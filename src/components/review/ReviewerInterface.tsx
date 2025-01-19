import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';
import { CommentThread, Comment } from '@/types/thesis';
import { CommentList } from './CommentList';
import { CommentInput } from './CommentInput';

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

        if (commentsError) throw commentsError;

        console.log('Fetched comments:', commentsData);
        
        const threadMap = new Map<string | null, Comment[]>();
        commentsData.forEach((comment: any) => {
          const transformedComment: Comment = {
            id: comment.id,
            content: typeof comment.content === 'string' ? comment.content : comment.content.text,
            reviewer_id: comment.reviewer_id,
            created_at: comment.created_at,
            profiles: comment.profiles
          };
          const parentId = comment.parent_id || null;
          if (!threadMap.has(parentId)) {
            threadMap.set(parentId, []);
          }
          threadMap.get(parentId)?.push(transformedComment);
        });

        const threads: CommentThread[] = (threadMap.get(null) || []).map(comment => ({
          comment,
          replies: threadMap.get(comment.id) || [],
          id: comment.id,
          content: typeof comment.content === 'string' ? comment.content : comment.content.text,
          author: comment.profiles?.email || 'Unknown',
          created_at: comment.created_at
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

        if (profileError) throw profileError;

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

  const handleSubmitComment = async (content: string) => {
    try {
      const { data, error } = await supabase
        .from('thesis_reviews')
        .insert([
          {
            thesis_id: thesisId,
            section_id: sectionId,
            reviewer_id: profile?.id,
            content: { text: content },
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

      const newThread: CommentThread = {
        comment: {
          id: data.id,
          content: { text: content },
          reviewer_id: profile?.id || '',
          created_at: data.created_at,
          profiles: data.profiles
        },
        replies: [],
        id: data.id,
        content: content,
        author: profile?.email || 'Unknown',
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
      <CommentInput onSubmit={handleSubmitComment} />
    </div>
  );
};