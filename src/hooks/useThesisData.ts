import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis, ThesisContent, Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ensureThesisStructure } from '@/utils/thesisUtils';

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<Section | null>(null);

  const { data: thesis, isLoading, error } = useQuery({
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
          throw new Error('Authentication required');
        }

        // Permission check
        const { data: permission, error: permissionError } = await supabase
          .from('thesis_collaborators')
          .select('role')
          .eq('thesis_id', thesisId)
          .eq('user_id', session.session.user.id)
          .maybeSingle();

        if (permissionError) throw permissionError;
        if (!permission) throw new Error('Access denied');

        // Fetch thesis data
        const { data: fetchedThesis, error: fetchError } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesisId)
          .single();

        if (fetchError) throw fetchError;
        if (!fetchedThesis) throw new Error('Thesis not found');

        return ensureThesisStructure(fetchedThesis);
      } catch (err: any) {
        console.error('Error fetching thesis:', err);
        toast({
          title: 'Error',
          description: err.message || 'Failed to load thesis',
          variant: 'destructive',
        });
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  return { 
    thesis, 
    isLoading, 
    error,
    setThesis: (updatedThesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => {
      queryClient.setQueryData(['thesis', thesisId], updatedThesis);
    }
  };
};