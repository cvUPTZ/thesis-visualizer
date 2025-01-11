// src/hooks/useThesisAutosave.ts
import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { Thesis } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';

export const useThesisAutosave = (thesis: Thesis | null) => {
  const { toast } = useToast();
  const lastSavedContent = useRef<string>(thesis ? JSON.stringify(thesis) : '');
  const lastToastTime = useRef<number>(0);
  const TOAST_COOLDOWN = 5000; // 5 seconds between toasts

  const saveThesis = useCallback(async (thesisData: Thesis) => {
      if (!thesisData) return;

      try {
        console.log('Auto-saving thesis:', thesisData.id);

        const serializedContent = JSON.stringify({
          metadata: thesisData.metadata,
          frontMatter: thesisData.frontMatter,
          chapters: thesisData.chapters,
          backMatter: thesisData.backMatter
        }) as unknown as Json;

        const { error, data } = await supabase
            .from('theses')
            .update({
              content: serializedContent,
              updated_at: new Date().toISOString()
            })
            .eq('id', thesisData.id)
            .select()
            .maybeSingle();

          if (error) throw error;

          if (!data) {
                console.log('Thesis was not found, skipping auto-save:', thesisData.id);
              return;
          }

        lastSavedContent.current = JSON.stringify(thesisData);
          console.log('Auto-save successful:', { id: thesisData.id, updateTime: data.updated_at });
          // Only show toast if enough time has passed since the last one
          const now = Date.now();
          if (now - lastToastTime.current >= TOAST_COOLDOWN) {
            lastToastTime.current = now;
            toast({
                title: "Auto-saved",
                description: "Your thesis has been automatically saved.",
            });
          }
      } catch (error) {
          console.error('Error auto-saving thesis:', error);
          toast({
              title: "Auto-save failed",
              description: "Failed to auto-save your thesis. Your changes will be saved on next successful attempt.",
              variant: "destructive",
          });
      }
  }, [toast]);


  const debouncedSave = useCallback(
    debounce((thesisData: Thesis) => {
      const currentContent = JSON.stringify(thesisData);
      if (currentContent !== lastSavedContent.current) {
        saveThesis(thesisData);
      }
    }, 2000),
    [saveThesis]
  );

  useEffect(() => {
    if (thesis) {
      debouncedSave(thesis);
    }
    return () => {
      debouncedSave.cancel();
    };
  }, [thesis, debouncedSave]);
};