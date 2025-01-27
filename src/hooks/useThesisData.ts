import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ensureThesisStructure } from '@/utils/thesisUtils';

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: thesis, isLoading, error } = useQuery({
    queryKey: ['thesis', thesisId],
    queryFn: async () => {
      if (!thesisId) return null;
      if (!validateUUID(thesisId)) throw new Error('Invalid thesis ID format');

      try {
        console.log('Fetching thesis data for ID:', thesisId);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.user) {
          console.error('No authenticated session found');
          throw new Error('Authentication required');
        }

        // First check if user has direct access through thesis_collaborators
        const { data: collaborator, error: collaboratorError } = await supabase
          .from('thesis_collaborators')
          .select('role')
          .eq('thesis_id', thesisId)
          .eq('user_id', session.session.user.id)
          .maybeSingle();

        if (collaboratorError) {
          console.error('Error checking collaborator status:', collaboratorError);
          throw collaboratorError;
        }

        // If not a collaborator, check if user is the supervisor
        if (!collaborator) {
          const { data: thesis, error: thesisError } = await supabase
            .from('theses')
            .select('supervisor_id')
            .eq('id', thesisId)
            .single();

          if (thesisError) throw thesisError;
          
          if (thesis?.supervisor_id !== session.session.user.id) {
            console.error('User does not have access to this thesis');
            throw new Error('Access denied');
          }
        }

        // Get the section ID from the URL
        const sectionId = window.location.pathname.split('/').pop();
        
        // Only proceed with section creation if it's a valid UUID
        if (sectionId && !validateUUID(sectionId)) {
          console.log('Creating new section with UUID');
          const { data: newSection, error: sectionError } = await supabase
            .rpc('create_section_if_not_exists', {
              p_thesis_id: thesisId,
              p_section_title: 'New Section',
              p_section_type: 'custom'
            });

          if (sectionError) {
            console.error('Error creating section:', sectionError);
            throw sectionError;
          }

          // Redirect to the new section URL
          if (newSection?.id) {
            window.history.replaceState(
              {}, 
              '', 
              `/thesis/${thesisId}/section/${newSection.id}`
            );
          }

          console.log('Created new section:', newSection);
        }

        // Fetch thesis data
        const { data: fetchedThesis, error: fetchError } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesisId)
          .single();

        if (fetchError) {
          console.error('Error fetching thesis:', fetchError);
          throw fetchError;
        }

        if (!fetchedThesis) {
          console.error('Thesis not found');
          throw new Error('Thesis not found');
        }

        console.log('Successfully fetched thesis data');
        return ensureThesisStructure(fetchedThesis);
      } catch (err: any) {
        console.error('Error in thesis data fetch:', err);
        throw err;
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.message === 'Access denied' || error?.message === 'Authentication required') {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error Loading Thesis",
          description: error.message || "Failed to load thesis",
          variant: "destructive",
        });
      }
    }
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