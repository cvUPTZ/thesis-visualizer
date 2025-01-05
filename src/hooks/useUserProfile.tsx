import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

export const useUserProfile = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async (): Promise<Profile | null> => {
      console.log('👤 Fetching user profile for:', userId);
      
      if (!userId) {
        console.log('❌ No user ID available for fetching profile');
        throw new Error('User ID is required');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          roles (
            name
          )
        `)
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