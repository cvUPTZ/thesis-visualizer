// src/hooks/useThesisAutosave.ts
import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { useNotification } from '@/contexts/NotificationContext';
import { Thesis } from '@/types/thesis';
import { thesisService } from '@/services/thesisService';

interface AutosaveOptions {
  debounceMs?: number;
  showToast?: boolean;
}

export const useThesisAutosave = (
  thesis: Thesis | null, 
  options: AutosaveOptions = {}
) => {
  const { toast } = useNotification();
  const saveInProgressRef = useRef<boolean>(false);
  const { debounceMs = 2000, showToast = true } = options;

  const saveThesis = useCallback(async (thesisData: Thesis) => {
    if (!thesisData || saveInProgressRef.current) return;

    try {
      saveInProgressRef.current = true;
      await thesisService.updateThesis(thesisData.id, thesisData);
      
      if (showToast) {
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
    } finally {
      saveInProgressRef.current = false;
    }
  }, [toast, showToast]);

  const debouncedSave = useCallback(
    debounce((thesisData: Thesis) => {
      saveThesis(thesisData);
    }, debounceMs),
    [saveThesis, debounceMs]
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
