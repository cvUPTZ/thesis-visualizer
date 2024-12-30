import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';

export const useThesisData = (thesisId: string | undefined) => {
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchThesis = async () => {
      if (!thesisId) {
        console.log('No thesis ID provided');
        setThesis(null);
        setIsLoading(false);
        return;
      }

      if (!validateUUID(thesisId)) {
        console.error('Invalid thesis ID format:', thesisId);
        setError('Invalid thesis ID format');
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Invalid thesis ID format",
          variant: "destructive",
        });
        return;
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
          setError(fetchError.message);
          toast({
            title: "Error",
            description: "Failed to load thesis. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (!data) {
          console.log('No thesis found with ID:', thesisId);
          setError('Thesis not found');
          toast({
            title: "Not Found",
            description: "The requested thesis could not be found.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
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
            createdAt: parsedContent?.metadata?.createdAt || new Date().toISOString()
          },
          frontMatter: parsedContent?.frontMatter || [],
          chapters: parsedContent?.chapters || [],
          backMatter: parsedContent?.backMatter || []
        };
        
        setThesis(thesisData);
        setError(null);
      } catch (err: any) {
        console.error("Error in thesis data hook:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load thesis data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchThesis();
  }, [thesisId, toast]);

  return { thesis, setThesis, isLoading, error };
};