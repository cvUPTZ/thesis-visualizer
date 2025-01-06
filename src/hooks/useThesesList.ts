import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ThesisListItem {
  id: string;
  title: string;
  thesis_collaborators?: {
    user_id: string;
    role: string;
  }[];
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
        setError('Please sign in to view your theses');
        toast({
          title: "Authentication Required",
          description: "Please sign in to view your theses",
          variant: "destructive",
        });
        return;
      }

      console.log('🔑 User authenticated, fetching theses for user:', session.session.user.id);

      // First get all thesis IDs the user has access to
      const { data: collaborations, error: collabError } = await supabase
        .from('thesis_collaborators')
        .select('thesis_id')
        .eq('user_id', session.session.user.id);

      if (collabError) {
        console.error('❌ Error fetching collaborations:', collabError);
        throw collabError;
      }

      if (!collaborations || collaborations.length === 0) {
        console.log('ℹ️ No theses found for user');
        setThesisList([]);
        return;
      }

      const thesisIds = collaborations.map(c => c.thesis_id);

      // Then fetch the actual theses
      const { data: thesesData, error: thesesError } = await supabase
        .from('theses')
        .select(`
          id,
          title,
          thesis_collaborators (
            user_id,
            role
          )
        `)
        .in('id', thesisIds);

      if (thesesError) {
        console.error('❌ Error fetching theses:', thesesError);
        throw thesesError;
      }

      console.log('✅ Theses loaded successfully:', thesesData);
      setThesisList(thesesData || []);

    } catch (error: any) {
      console.error('❌ Unexpected error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load your theses. Please try again.",
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