import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';
import { useToast } from './use-toast';
import { debounce } from 'lodash';

export const useThesisRealtime = (
  thesisId: string | undefined,
  setThesis: React.Dispatch<React.SetStateAction<Thesis | null>>
) => {
  const { toast } = useToast();
  const thesisRef = useRef<Thesis | null>(null);

  const deepMergeUpdates = (existing: Thesis, update: Thesis): Thesis => ({
    ...existing,
    ...update,
    content: {
      ...existing.content,
      ...update.content,
      metadata: update.content.metadata || existing.content.metadata,
      frontMatter: update.content.frontMatter || existing.content.frontMatter,
      chapters: update.content.chapters || existing.content.chapters,
      backMatter: update.content.backMatter || existing.content.backMatter,
    }
  });

  useEffect(() => {
    if (!thesisId) return;

    const showUpdateNotification = debounce(() => {
      toast({ title: "Changes Detected", description: "New updates from collaborators" });
    }, 3000);

    const channel = supabase
      .channel('thesis-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'theses',
          filter: `id=eq.${thesisId}`
        },
        (payload) => {
          try {
            const newThesis = payload.new as Thesis;
            const currentThesis = thesisRef.current;

            if (!currentThesis || 
                newThesis.updated_at <= currentThesis.updated_at ||
                newThesis.user_id === currentThesis.user_id) return;

            setThesis(prev => prev ? deepMergeUpdates(prev, newThesis) : prev);
            showUpdateNotification();
          } catch (error) {
            console.error('Realtime update error:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      showUpdateNotification.cancel();
    };
  }, [thesisId, toast]);

  // Sync ref with latest thesis value
  const updateRef = (thesis: Thesis | null) => {
    thesisRef.current = thesis;
    return thesis;
  };

  return { updateRef };
};