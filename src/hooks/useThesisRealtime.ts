import { useEffect, useRef, useCallback } from 'react';
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
  
  // Use refs to maintain values across renders without triggering effects
  const lastUpdateTimeRef = useRef<string>(new Date().toISOString());
  const lastProcessedContentRef = useRef<string>(
    currentThesis ? JSON.stringify(currentThesis) : ''
  );
  const currentThesisRef = useRef<Thesis | null>(currentThesis);

  // Update ref when currentThesis changes
  useEffect(() => {
    currentThesisRef.current = currentThesis;
  }, [currentThesis]);

  // Memoize the update handler
  const handleThesisUpdate = useCallback((payload: any) => {
    const current = currentThesisRef.current;
    if (!current) return;

    // Skip if we're the ones who made the change
    if (payload.new.updated_at === current.updated_at) {
      console.log('Skipping own update');
      return;
    }

    // Skip if this update is too close to the last one we processed
    if (payload.new.updated_at <= lastUpdateTimeRef.current) {
      console.log('Skipping duplicate/old update');
      return;
    }

    // Skip if the content hasn't actually changed
    const newContentStr = JSON.stringify(payload.new.content);
    if (newContentStr === lastProcessedContentRef.current) {
      console.log('Content unchanged, skipping update');
      return;
    }

    lastUpdateTimeRef.current = payload.new.updated_at;
    lastProcessedContentRef.current = newContentStr;
    const newContent = payload.new.content;
    
    if (!newContent) {
      console.log('Update contained no content, skipping');
      return;
    }

    // Use function form of setState to ensure we're working with latest state
    setThesis(prevThesis => {
      if (!prevThesis) return null;
      return {
        ...prevThesis,
        ...payload.new,
        metadata: newContent.metadata || prevThesis.metadata,
        frontMatter: newContent.frontMatter || prevThesis.frontMatter,
        chapters: newContent.chapters || prevThesis.chapters,
        backMatter: newContent.backMatter || prevThesis.backMatter,
      };
    });
  }, [setThesis]);

  // Memoize notification toast
  const showUpdateNotification = useCallback(
    debounce(() => {
      toast({
        title: "Thesis Updated",
        description: "Changes from another collaborator have been applied",
      });
    }, 5000),
    [toast]
  );

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
          handleThesisUpdate(payload);
          showUpdateNotification();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      showUpdateNotification.cancel();
      supabase.removeChannel(channel);
    };
  }, [thesisId, handleThesisUpdate, showUpdateNotification]);
};