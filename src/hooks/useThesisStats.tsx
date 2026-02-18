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
        throw new Error('User ID is required');
      }

      const { data: theses, error } = await supabase
        .from('theses' as any)
        .select('id, status')
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error fetching thesis stats:', error);
        throw error;
      }

      const thesesArr = (theses || []) as any[];

      return {
        total: thesesArr.length,
        inProgress: thesesArr.filter((t: any) => t.status === 'draft' || t.status === 'in_review').length,
        completed: thesesArr.filter((t: any) => t.status === 'published').length,
      };
    },
    retry: 1,
    staleTime: 30000,
    enabled: !!userId,
  });
};
