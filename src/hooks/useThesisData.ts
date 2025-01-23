import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis, ThesisContent, SectionType } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ensureThesisStructure } from '@/utils/thesisUtils';

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: thesis,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['thesis', thesisId],
    queryFn: async () => {
      if (!thesisId) {
        console.log('No thesis ID provided');
        return null;
      }

      if (!validateUUID(thesisId)) {
        console.error('Invalid thesis ID format:', thesisId);
        throw new Error('Invalid thesis ID format');
      }

      try {
        console.log('Fetching thesis data for ID:', thesisId);
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          console.error('No authenticated user found');
          throw new Error('Authentication required');
        }

        // First check if user has permission to access this thesis
        const { data: permission, error: permissionError } = await supabase
          .from('thesis_collaborators')
          .select('role')
          .eq('thesis_id', thesisId)
          .eq('user_id', session.session.user.id)
          .maybeSingle();

        if (permissionError) {
          console.error('Error checking thesis permissions:', permissionError);
          throw new Error('Error checking thesis permissions');
        }

        if (!permission) {
          console.error('User does not have permission to access this thesis');
          throw new Error('Access denied');
        }

        // Fetch thesis with complete structure
        const { data: fetchedThesis, error: fetchError } = await supabase
          .from('theses')
          .select(`
            *,
            thesis_collaborators (
              user_id,
              role,
              profiles (
                email
              )
            )
          `)
          .eq('id', thesisId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching thesis data:', fetchError);
          throw new Error('Error fetching thesis data');
        }

        if (!fetchedThesis) {
          console.error('Thesis not found:', thesisId);
          return null;
        }

        // Ensure thesis has complete structure before returning
        const completeThesis = ensureThesisStructure({
          ...fetchedThesis,
          content: typeof fetchedThesis.content === 'string' 
            ? JSON.parse(fetchedThesis.content) 
            : fetchedThesis.content
        });

        console.log('Fetched and structured thesis:', completeThesis);
        return completeThesis;

      } catch (err: any) {
        console.error('Error in thesis data fetch:', err);
        toast({
          title: 'Error',
          description: err.message || 'Failed to load thesis',
          variant: 'destructive',
        });
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const setThesis = (newThesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => {
    queryClient.setQueryData(['thesis', thesisId], newThesis);
  };

  return { thesis, setThesis, isLoading, error };
};