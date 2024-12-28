import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';

export const useThesisAutosave = (thesis: Thesis) => {
  const { toast } = useToast();
  const lastSavedContent = useRef<string>(JSON.stringify(thesis));

  const saveThesis = useCallback(async (thesisData: Thesis) => {
    try {
      console.log('Auto-saving thesis:', thesisData.id);
      const { error } = await supabase
        .from('theses')
        .update({ 
          content: JSON.stringify(thesisData), // Convert to string to satisfy Json type
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisData.id);

      if (error) throw error;
      
      lastSavedContent.current = JSON.stringify(thesisData);
      console.log('Auto-save successful');
      
      toast({
        title: "Auto-saved",
        description: "Your thesis has been automatically saved.",
      });
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
    debouncedSave(thesis);
    return () => {
      debouncedSave.cancel();
    };
  }, [thesis, debouncedSave]);
};