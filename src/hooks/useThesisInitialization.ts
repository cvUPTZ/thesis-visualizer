
// src/hooks/useThesisInitialization.ts
import { useEffect, useRef } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Thesis } from '@/types/thesis';
import { thesisService } from '@/services/thesisService';

interface ThesisError extends Error {
  code?: string;
  status?: number;
}

export const useThesisInitialization = (thesis: Thesis | null) => {
  const { toast } = useNotification();
  const initializationRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const initializeThesis = async () => {
      if (!thesis || initializationRef.current) return;

      try {
        initializationRef.current = true;
        await thesisService.initializeThesis(thesis);
      } catch (error) {
        const thesisError = error as ThesisError;
        if (mounted) {
          console.error('Error in thesis initialization:', thesisError);
          toast({
            title: "Error",
            description: thesisError.message || "Failed to initialize thesis. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    initializeThesis();

    return () => {
      mounted = false;
    };
  }, [thesis, toast]);
};
