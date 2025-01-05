import { supabase } from "@/integrations/supabase/client";
import type { AuthState } from '@/types/auth';

export const authService = {
  async signIn(email: string, password: string): Promise<void> {
    console.log('🔄 Attempting to sign in user:', email);
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('❌ Sign in error:', signInError);
      throw signInError;
    }

    if (!authData.user) {
      console.error('❌ No user data returned');
      throw new Error('Authentication failed');
    }

    console.log('✅ Sign in successful');
  },

  async signOut(): Promise<void> {
    console.log('🔄 Signing out user...');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('✅ Sign out successful');
  },

  async getSession(): Promise<AuthState> {
    console.log('🔄 Fetching auth session...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error fetching session:', error);
      return { user: null, isLoading: false, error };
    }

    if (!session?.user) {
      console.log('ℹ️ No active session');
      return { user: null, isLoading: false, error: null };
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
      return { user: null, isLoading: false, error: profileError };
    }

    const user = {
      id: session.user.id,
      email: profile.email,
      role: profile.roles?.name || null,
    };

    console.log('✅ Session loaded:', user);
    return { user, isLoading: false, error: null };
  }
};