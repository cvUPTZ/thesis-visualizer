import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ThesisStats {
  total: number;
  inProgress: number;
  completed: number;
}

export const useThesisStats = (userId: string | null) => {
  return useQuery({
    queryKey: ['thesis-stats', userId],
    queryFn: async (): Promise<ThesisStats> => {
      console.log('📊 Fetching thesis stats for user:', userId);
      
      if (!userId) {
        console.log('❌ No user ID available for fetching thesis stats');
        throw new Error('User ID is required');
      }

      const { data: theses, error } = await supabase
        .from('thesis_collaborators')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error fetching thesis stats:', error);
        throw error;
      }

      console.log('✅ Thesis stats fetched:', theses);

      return {
        total: theses?.length || 0,
        inProgress: theses?.filter(t => t.role === 'editor').length || 0,
        completed: theses?.filter(t => t.role === 'owner').length || 0,
      };
    },
    retry: 1,
    staleTime: 30000,
    enabled: !!userId,
  });
};