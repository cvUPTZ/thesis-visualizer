import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const authService = {
  async getSession() {
    console.log('🔍 Getting current session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error getting session:', error);
      throw error;
    }
    
    return session;
  },

  async getUserRole(userId: string) {
    console.log('🔍 Fetching user role for:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('roles (name)')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Error fetching user role:', error);
      throw error;
    }

    return data?.roles?.name;
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