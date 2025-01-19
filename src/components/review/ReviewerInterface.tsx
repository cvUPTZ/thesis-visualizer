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
        
        // Transform the flat comments into a thread structure
        const threadMap = new Map<string | null, CommentThread['comment'][]>();
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
          replies: threadMap.get(comment.id) || [],
          id: comment.id,
          content: comment.content.text,
          author: comment.profiles.email,
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

  const handleSubmitComment = async (content: string) => {
    try {
      console.log('Submitting new comment');
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

      console.log('New comment submitted:', data);
      
      // Add the new comment as a new thread
      const newThread: CommentThread = {
        comment: transformComment(data),
        replies: [],
        id: data.id,
        content: data.content.text,
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
