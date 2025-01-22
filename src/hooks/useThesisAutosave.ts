import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';
import { ensureThesisStructure } from '@/utils/thesis';

export const useThesisAutosave = (thesis: Thesis | null) => {
  const { toast } = useToast();
  const lastSavedContent = useRef<string>(thesis ? JSON.stringify(thesis) : '');
  const lastToastTime = useRef<number>(0);
  const TOAST_COOLDOWN = 5000; // 5 seconds between toasts

  const saveThesis = useCallback(async (thesisData: Thesis | null) => {
    if (!thesisData || !thesisData.id) {
      console.log('No thesis data to save');
      return;
    }
    
    console.log('Thesis object before saving:', thesisData);
    console.log('Thesis object structure:', {
      hasId: !!thesisData.id,
      hasTitle: !!thesisData.title,
      hasDescription: !!thesisData.description,
      hasMetadata: !!thesisData.metadata,
      hasFrontMatter: Array.isArray(thesisData.frontMatter),
      hasGeneralIntroduction: !!thesisData.generalIntroduction,
      hasChapters: Array.isArray(thesisData.chapters),
      hasGeneralConclusion: !!thesisData.generalConclusion,
      hasBackMatter: Array.isArray(thesisData.backMatter)
    });
    
    try {
      console.log('Auto-saving thesis:', thesisData.id);
      
      // Use the utility function to ensure all required fields are present
      const safeThesisData = ensureThesisStructure(thesisData);

      const serializedContent = JSON.stringify(safeThesisData) as unknown as Json;

      const { error } = await supabase
        .from('theses')
        .update({ 
          content: serializedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisData.id);

      if (error) {
        console.error('Supabase error while saving:', error);
        throw new Error(error.message);
      }
      
      lastSavedContent.current = JSON.stringify(thesisData);
      console.log('Auto-save successful');
      
      // Only show toast if enough time has passed since the last one
      const now = Date.now();
      if (now - lastToastTime.current >= TOAST_COOLDOWN) {
        lastToastTime.current = now;
        toast({
          title: "Auto-saved",
          description: "Your thesis has been automatically saved.",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error auto-saving thesis:', error);
      toast({
        title: "Auto-save failed",
        description: error instanceof Error ? error.message : "Failed to save your thesis. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Debounced version of saveThesis
  const debouncedSave = useCallback(
    debounce((thesis: Thesis) => {
      saveThesis(thesis);
    }, 2000),
    [saveThesis]
  );

  useEffect(() => {
    if (!thesis) return;

    const currentContent = JSON.stringify(thesis);
    if (currentContent !== lastSavedContent.current) {
      debouncedSave(thesis);
    }

    return () => {
      debouncedSave.cancel();
    };
  }, [thesis, debouncedSave]);

  return { saveThesis };
};