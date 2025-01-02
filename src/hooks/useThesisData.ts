
// src/hooks/useThesisData.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/contexts/NotificationContext';
import { validate as validateUUID } from 'uuid';
import { Thesis } from '@/types/thesis';
import { thesisService } from '@/services/thesisService';
import { useCallback, useMemo } from 'react';

interface ThesisError extends Error {
  code?: string;
  status?: number;
}

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useNotification();
  const queryClient = useQueryClient();

  const queryFn = useCallback(async () => {
    if (!thesisId) {
      return null;
    }

    try {
      if (!validateUUID(thesisId)) {
        throw new Error('Invalid thesis ID format');
      }

      return await thesisService.getThesis(thesisId);
    } catch (error) {
      const thesisError = error as ThesisError;
      toast({
        title: "Error",
        description: thesisError.message || "Failed to load thesis data. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [thesisId, toast]);

  const queryOptions = useMemo(() => ({
    queryKey: ['thesis', thesisId],
    queryFn,
    enabled: !!thesisId,
    retry: (failureCount: number, error: Error) => {
      return failureCount < 3 && error.message !== 'Invalid thesis ID format';
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  }), [thesisId, queryFn]);

  const { data: thesis, isLoading, error } = useQuery<Thesis | null, Error>(queryOptions);

  const setThesis = useCallback((
    newThesis: Thesis | ((prev: Thesis | null) => Thesis | null)
  ) => {
    queryClient.setQueryData(['thesis', thesisId], newThesis);
  }, [queryClient, thesisId]);

  return { thesis, setThesis, isLoading, error };
};