import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: thesis,
    isLoading,
    error,
  } = useQuery<Thesis | null, string>({
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
        console.log('Fetching thesis with ID:', thesisId);

        const { data, error: fetchError } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesisId)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching thesis:", fetchError);
          throw new Error(fetchError.message);
        }

        if (!data) {
          console.log('No thesis found with ID:', thesisId);
          throw new Error('Thesis not found');
        }

        console.log('Thesis data loaded:', data);

        const parsedContent = typeof data.content === 'string'
          ? JSON.parse(data.content)
          : data.content;

        const thesisData: Thesis = {
          id: data.id,
          metadata: {
            description: parsedContent?.metadata?.description || '',
            keywords: parsedContent?.metadata?.keywords || [],
            createdAt: parsedContent?.metadata?.createdAt || new Date().toISOString(),
            universityName: parsedContent?.metadata?.universityName,
            departmentName: parsedContent?.metadata?.departmentName,
            authorName: parsedContent?.metadata?.authorName,
            thesisDate: parsedContent?.metadata?.thesisDate,
            committeeMembers: parsedContent?.metadata?.committeeMembers
          },
          frontMatter: parsedContent?.frontMatter || [],
          chapters: parsedContent?.chapters || [],
          backMatter: parsedContent?.backMatter || []
        };

        return thesisData;
      } catch (err: any) {
        console.error("Error in thesis data hook:", err);
        toast({
          title: "Error",
          description: "Failed to load thesis data. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
    enabled: !!thesisId,
  });

  const setThesis = (newThesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => {
    queryClient.setQueryData(['thesis', thesisId], newThesis);
  };

  return { thesis, setThesis, isLoading, error };
};