import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';
import { useToast } from './use-toast';
import { debounce } from 'lodash';

export const useThesisRealtime = (
  thesisId: string | undefined,
  currentThesis: Thesis | null,
  setThesis: (thesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => void
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!thesisId || !currentThesis) return;

    console.log('Setting up realtime subscription for thesis:', thesisId);

    // Create a debounced version of the notification toast
    const showUpdateNotification = debounce(() => {
      toast({
        title: "Thesis Updated",
        description: "Changes from another collaborator have been applied",
      });
    }, 5000); // Show notification at most once every 5 seconds

    let lastUpdateTime = new Date().toISOString();
    let lastProcessedContent = JSON.stringify(currentThesis);

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

          // Skip if this update is too close to the last one we processed
          if (payload.new.updated_at <= lastUpdateTime) {
            console.log('Skipping duplicate/old update');
            return;
          }

          // Skip if the content hasn't actually changed
          const newContentStr = JSON.stringify(payload.new.content);
          if (newContentStr === lastProcessedContent) {
            console.log('Content unchanged, skipping update');
            return;
          }

          lastUpdateTime = payload.new.updated_at;
          lastProcessedContent = newContentStr;
          const newContent = payload.new.content;
          
          if (!newContent) {
            console.log('Update contained no content, skipping');
            return;
          }

          setThesis({
            ...currentThesis,
            ...payload.new,
            metadata: newContent.metadata || currentThesis.metadata,
            frontMatter: newContent.frontMatter || currentThesis.frontMatter,
            chapters: newContent.chapters || currentThesis.chapters,
            backMatter: newContent.backMatter || currentThesis.backMatter,
          });

          // Show notification about the update
          showUpdateNotification();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      console.log('Cleaning up realtime subscription');
      showUpdateNotification.cancel(); // Cancel any pending notifications
      supabase.removeChannel(channel);
    };
  }, [thesisId, currentThesis?.id]);
};