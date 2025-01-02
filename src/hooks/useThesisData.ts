// src/hooks/useThesisData.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/contexts/NotificationContext';
import { validate as validateUUID } from 'uuid';
import { Thesis } from '@/types/thesis';
import { thesisService } from '@/services/thesisService';
import { useCallback } from 'react';

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useNotification();
    const queryClient = useQueryClient();

  const queryFn = useCallback(async () => {
        if (!thesisId) {
           console.log('No thesis ID provided on useThesisData hook');
             return null;
       }
        if (!validateUUID(thesisId)) {
           console.error('Invalid thesis ID format:', thesisId);
             throw new Error('Invalid thesis ID format');
      }
        try {
            console.log('Fetching thesis data with ID:', thesisId);
            return await thesisService.getThesis(thesisId);
       } catch (err: any) {
           console.error("Error in useThesisData:", err);
          toast({
                title: "Error",
                 description: err.message || "Failed to load thesis data. Please try again.",
                variant: "destructive",
             });
          throw err;
         }
   },[thesisId, toast])

   const {
    data: thesis,
        isLoading,
        error,
    } = useQuery<Thesis | null, Error>({
        queryKey: ['thesis', thesisId],
        queryFn,
        enabled: !!thesisId, // Skip if no thesisId
    });

    const setThesis = (newThesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => {
      queryClient.setQueryData(['thesis', thesisId], newThesis);
    };

  return { thesis, setThesis, isLoading, error };
};