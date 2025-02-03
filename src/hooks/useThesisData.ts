
import { supabase } from '@/integrations/supabase/client';
import { Thesis, Section, ThesisContent } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ensureThesisStructure } from '@/utils/thesisUtils';
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const validateThesisContent = (content: any): content is ThesisContent => {
  if (!content || typeof content !== 'object') return false;
  
  return (
    'metadata' in content &&
    'frontMatter' in content &&
    'generalIntroduction' in content &&
    'chapters' in content &&
    'generalConclusion' in content &&
    'backMatter' in content &&
    Array.isArray(content.frontMatter) &&
    Array.isArray(content.chapters) &&
    Array.isArray(content.backMatter)
  );
};

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSectionCreation = useCallback(async (currentSectionId: string) => {
    if (!thesisId) return null;
    
    try {
      console.log('Creating new section with UUID');
      const newSectionId = crypto.randomUUID();
      
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

      if (newSection) {
        console.log('Created new section:', newSection);
        navigate(`/thesis/${thesisId}/section/${newSectionId}`, { replace: true });
        return newSection;
      }
    } catch (err) {
      console.error('Error in section creation:', err);
      toast({
        title: "Error",
        description: "Failed to create new section",
        variant: "destructive"
      });
    }
    return null;
  }, [thesisId, navigate, toast]);

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

        const { data: fetchedThesis, error: fetchError } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesisId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching thesis:', fetchError);
          throw fetchError;
        }

        if (!fetchedThesis) {
          console.error('Thesis not found');
          throw new Error('Thesis not found');
        }

        // Ensure content structure is valid
        if (!validateThesisContent(fetchedThesis.content)) {
          console.error('Invalid thesis content structure:', fetchedThesis.content);
          throw new Error('Invalid thesis content structure');
        }

        console.log('Successfully fetched thesis data');
        return ensureThesisStructure(fetchedThesis);
      } catch (err: any) {
        console.error('Error in thesis data fetch:', err);
        toast({
          title: "Error",
          description: err.message || "Failed to load thesis",
          variant: "destructive"
        });
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
  });

  useEffect(() => {
    const createSectionIfNeeded = async () => {
      if (!thesis || !thesisId) return;

      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/');
      const currentSectionId = pathParts[pathParts.length - 1];

      if (!validateUUID(currentSectionId)) {
        await handleSectionCreation(currentSectionId);
      }
    };

    createSectionIfNeeded();
  }, [thesis, thesisId, handleSectionCreation]);

  return {
    thesis,
    isLoading,
    error,
    setThesis: (updatedThesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => {
      queryClient.setQueryData(['thesis', thesisId], updatedThesis);
    }
  };
};
