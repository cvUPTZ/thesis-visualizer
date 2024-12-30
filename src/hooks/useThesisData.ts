import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';

export const useThesisData = (thesisId: string | undefined) => {
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThesis = async () => {
      if (!thesisId) {
        setThesis(null);
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesisId)
          .single();

        if (error) {
          console.error("Error fetching thesis:", error);
          setIsLoading(false);
          return;
        }

        if (data) {
          const parsedContent = typeof data.content === 'string' 
            ? JSON.parse(data.content) 
            : data.content;

          const thesisData: Thesis = {
            id: data.id,
            metadata: {
              description: parsedContent?.metadata?.description || '',
              keywords: parsedContent?.metadata?.keywords || [],
              createdAt: parsedContent?.metadata?.createdAt || new Date().toISOString()
            },
            frontMatter: parsedContent?.frontMatter || [],
            chapters: parsedContent?.chapters || [],
            backMatter: parsedContent?.backMatter || []
          };
          setThesis(thesisData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching thesis:", error);
        setIsLoading(false);
      }
    };

    fetchThesis();
  }, [thesisId]);

  return { thesis, setThesis, isLoading };
};