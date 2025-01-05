import { supabase } from "@/integrations/supabase/client";

export const authService = {
  async getSession() {
    console.log('🔍 Getting current session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error getting session:', error);
      throw error;
    }
    
    console.log('✅ Session retrieved:', session?.user?.email);
    return session;
  },

  async getUserRole(userId: string) {
    if (!userId) {
      console.error('❌ No user ID provided for role fetch');
      return null;
    }

    console.log('🔍 Fetching user role for:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          roles (
            name
          )
        `)
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user role:', error);
        return null;
      }

      if (!data?.roles?.name) {
        console.log('ℹ️ No role found for user');
        return 'user'; // Default role if none is set
      }

      console.log('✅ User role retrieved:', data.roles.name);
      return data.roles.name;
    } catch (error) {
      console.error('❌ Error in getUserRole:', error);
      return null;
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    console.log('🔄 Setting up auth state listener');
    return supabase.auth.onAuthStateChange(callback);
  },

  async signOut() {
    console.log('🔄 Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
    console.log('✅ Sign out successful');
  }
};