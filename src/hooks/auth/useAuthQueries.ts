import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/auth';

export const useAuthQueries = () => {
  const fetchInitialSession = async () => {
    console.log('🔄 Fetching initial auth session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error fetching session:', error);
      return { user: null, isAuthenticated: false };
    }

    if (!session?.user) {
      console.log('ℹ️ No active session');
      return { user: null, isAuthenticated: false };
    }

    try {
      console.log('✅ Session found, fetching profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, roles (name)')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        throw profileError;
      }

      const user: User = {
        ...session.user,
        role: profile.roles?.name || null
      };

      console.log('✅ Initial auth data loaded:', { user });
      return { user, isAuthenticated: true };
    } catch (error) {
      console.error('❌ Profile fetch error:', error);
      return { user: null, isAuthenticated: false };
    }
  };

  return useQuery({
    queryKey: ['auth-session-initial'],
    queryFn: fetchInitialSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};