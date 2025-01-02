// src/hooks/useThesisInitialization.ts
import { useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Thesis } from '@/types/thesis';
import { thesisService } from '@/services/thesisService';
export const useThesisInitialization = (thesis: Thesis | null) => {
  const { toast } = useNotification();
    useEffect(() => {
         const initializeThesis = async () => {
             if (!thesis) return;
             try {
                 await thesisService.initializeThesis(thesis)
            } catch (error: any) {
                 console.error('Error in thesis initialization:', error);
                  toast({
                      title: "Error",
                      description: error.message || "Failed to initialize thesis. Please try again.",
                        variant: "destructive",
                    });
            }
        };

        initializeThesis();
    }, [thesis, toast]);
};