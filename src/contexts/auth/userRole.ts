import { supabase } from '@/integrations/supabase/client';

export const fetchUserRole = async (userId: string): Promise<string | null> => {
  try {
    console.log('🔍 Fetching role for user:', userId);
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

    console.log('✅ Role fetched successfully:', data?.roles?.name);
    return data?.roles?.name || null;
  } catch (error) {
    console.error('❌ Error in fetchUserRole:', error);
    return null;
  }
};