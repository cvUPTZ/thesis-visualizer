import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string | null;
  role: string | null;
  full_name: string | null;
  created_at: string;
}

export const useUserProfile = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async (): Promise<UserProfile | null> => {
      console.log('👤 Fetching user profile for:', userId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        throw error;
      }

      console.log('✅ Profile fetched:', profile);
      return profile;
    },
    retry: 1,
    staleTime: 30000,
    enabled: !!userId,
  });
};
