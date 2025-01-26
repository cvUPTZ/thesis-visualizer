import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';
import { ensureThesisStructure } from '@/utils/thesisUtils';
import { Mutex } from 'async-mutex';

const saveMutex = new Mutex();

export const useThesisAutosave = (thesis: Thesis | null) => {
  const { toast } = useToast();
  const lastSavedContent = useRef<string>(thesis ? JSON.stringify(thesis) : '');
  const lastToastTime = useRef<number>(0);
  const TOAST_COOLDOWN = 5000; // 5 seconds between toasts

  const saveThesis = useCallback(async (thesisData: Thesis | null) => {
    if (!thesisData?.id) {
      console.log('No thesis data to save');
      return;
    }

    const currentContent = JSON.stringify(thesisData);
    if (currentContent === lastSavedContent.current) {
      console.log('No changes to save');
      return;
    }
    
    // Use mutex to prevent concurrent saves
    await saveMutex.acquire();
    
    try {
      console.log('Auto-saving thesis:', thesisData.id);
      
      const safeThesisData = ensureThesisStructure(thesisData);
      const serializedContent = JSON.stringify(safeThesisData) as unknown as Json;

      const { error } = await supabase
        .from('theses')
        .update({ 
          content: serializedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisData.id);

      if (error) throw error;
      
      lastSavedContent.current = currentContent;
      console.log('Auto-save successful');
      
      const now = Date.now();
      if (now - lastToastTime.current >= TOAST_COOLDOWN) {
        lastToastTime.current = now;
        toast({
          title: "Auto-saved",
          description: "Your thesis has been automatically saved.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error auto-saving thesis:', error);
      toast({
        title: "Auto-save failed",
        description: error instanceof Error ? error.message : "Failed to save your thesis. Please try again.",
        variant: "destructive"
      });
    } finally {
      saveMutex.release();
    }
  }, [toast]);

  const debouncedSave = useCallback(
    debounce((thesis: Thesis) => {
      saveThesis(thesis);
    }, 2000),
    [saveThesis]
  );

  useEffect(() => {
    if (!thesis) return;
    debouncedSave(thesis);
    return () => {
      debouncedSave.cancel();
    };
  }, [thesis, debouncedSave]);

  return { saveThesis };
};