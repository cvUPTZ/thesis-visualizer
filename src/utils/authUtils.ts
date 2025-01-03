import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { NavigateFunction } from 'react-router-dom';

export const fetchUserRole = async (userId: string) => {
  console.log(`Fetching user role for user ID: ${userId}`);
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        role_id,
        roles (
          name
        )
      `)
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    
    console.log(`Fetched user role: ${profile?.roles?.name || null}`);
    return profile?.roles?.name || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export const handleAuthError = (navigate: NavigateFunction) => {
  console.log('Handling auth error, redirecting to /auth');
  navigate('/auth', { replace: true });
};

export const initializeAuth = async () => {
  console.log('Initializing auth...');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('Auth initialization error:', error);
    return { session: null, error };
  }
};

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  userRole: string | null;
  userId: string | null;
  user: User | null;
  session: Session | null;
}

export const getInitialAuthState = (): AuthState => ({
  isAuthenticated: false,
  loading: true,
  userRole: null,
  userId: null,
  user: null,
  session: null,
});