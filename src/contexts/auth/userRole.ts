import { supabase } from '@/integrations/supabase/client';

export const fetchUserRole = async (userId: string) => {
  try {
    console.log('🔍 Fetching user role for:', userId);
    const { data: profile, error } = await supabase
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
      throw error;
    }

    const roleName = profile?.roles?.name || null;
    console.log('✅ User role fetched:', roleName);
    return roleName;
  } catch (error) {
    console.error('❌ Error in fetchUserRole:', error);
    throw error;
  }
};