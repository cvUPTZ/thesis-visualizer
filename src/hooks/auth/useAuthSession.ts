import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState, User } from '@/types/auth';

export const useAuthSession = () => {
  return useQuery({
    queryKey: ['auth-session'],
    queryFn: async (): Promise<AuthState> => {
      console.log('🔄 Fetching auth session...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error fetching session:', error);
        return { user: null, isAuthenticated: false };
      }

      if (!session?.user) {
        console.log('ℹ️ No active session');
        return { user: null, isAuthenticated: false };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          email,
          roles (
            name
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        return { user: null, isAuthenticated: false };
      }

      const user: User = {
        id: session.user.id,
        email: profile.email,
        role: profile.roles?.name || null,
      };

      console.log('✅ Session loaded:', user);
      return { user, isAuthenticated: true };
    },
    staleTime: 1000 * 60 * 5, // Consider session data fresh for 5 minutes
    refetchOnWindowFocus: true,
  });
};