import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ThesisListItem {
  id: string;
  title: string;
}

export const useThesesList = () => {
  const [thesisList, setThesisList] = useState<ThesisListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTheses = async () => {
    try {
      console.log('📚 Fetching theses list...');
      setIsLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.error('❌ No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "Please sign in to view your theses",
          variant: "destructive",
        });
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('theses')
        .select(`
          id,
          title,
          thesis_collaborators!inner (
            user_id,
            role
          )
        `)
        .eq('thesis_collaborators.user_id', session.session.user.id);

      if (fetchError) {
        console.error('❌ Error fetching theses:', fetchError);
        setError(fetchError.message);
        toast({
          title: "Error",
          description: "Failed to load your theses. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        console.log('✅ Theses loaded:', data);
        setThesisList(data as ThesisListItem[]);
      }
    } catch (error: any) {
      console.error('❌ Unexpected error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    thesisList,
    isLoading,
    error,
    fetchTheses
  };
};