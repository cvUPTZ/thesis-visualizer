import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';
import { useToast } from './use-toast';

export const useThesisRealtime = (
  thesisId: string | undefined,
  currentThesis: Thesis | null,
  setThesis: (thesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => void
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!thesisId || !currentThesis) return;

    console.log('Setting up realtime subscription for thesis:', thesisId);

    const channel = supabase
      .channel('thesis_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'theses',
          filter: `id=eq.${thesisId}`
        },
        (payload) => {
          console.log('Received thesis update:', payload);
          
          // Skip if we're the ones who made the change
          if (payload.new.updated_at === currentThesis.updated_at) {
            console.log('Skipping own update');
            return;
          }

          const newContent = payload.new.content;
          if (!newContent) return;

          setThesis({
            ...currentThesis,
            ...payload.new,
            metadata: newContent.metadata || currentThesis.metadata,
            frontMatter: newContent.frontMatter || currentThesis.frontMatter,
            chapters: newContent.chapters || currentThesis.chapters,
            backMatter: newContent.backMatter || currentThesis.backMatter,
          });

          toast({
            title: "Thesis Updated",
            description: "Changes from another user have been applied",
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [thesisId, currentThesis?.id]);
};