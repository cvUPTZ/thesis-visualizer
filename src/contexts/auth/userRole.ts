import { supabase } from '@/integrations/supabase/client';

export const fetchUserRole = async (userId: string): Promise<string | null> => {
  try {
    console.log('🔍 Fetching role for user:', userId);
    
    if (!userId) {
      console.log('❌ No user ID provided for role fetch');
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        roles (
          name
        )
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Error fetching user role:', error);
      return null;
    }

    if (!profile?.roles?.name) {
      console.log('ℹ️ No role found for user');
      return null;
    }

    console.log('✅ Role fetched successfully:', profile.roles.name);
    return profile.roles.name;
  } catch (error) {
    console.error('❌ Error in fetchUserRole:', error);
    return null;
  }
};