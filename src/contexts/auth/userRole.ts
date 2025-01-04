import { supabase } from '@/integrations/supabase/client';

export const fetchUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        roles (
          name
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    return data?.roles?.name || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};