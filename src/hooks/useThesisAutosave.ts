    // src/hooks/useThesisAutosave.ts
    import { useCallback, useEffect } from 'react';
    import { debounce } from 'lodash';
    import { useNotification } from '@/contexts/NotificationContext';
    import { Thesis } from '@/types/thesis';
    import { thesisService } from '@/services/thesisService';

    export const useThesisAutosave = (thesis: Thesis | null) => {
        const { toast } = useNotification();

      const saveThesis = useCallback(async (thesisData: Thesis) => {
            if (!thesisData) return;

            try {
              console.log('Auto-saving thesis:', thesisData.id);
             await thesisService.updateThesis(thesisData.id, thesisData);
                console.log('Auto-save successful');
               toast({
                    title: "Auto-saved",
                     description: "Your thesis has been automatically saved.",
                });
           } catch (error: any) {
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
                saveThesis(thesisData);
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