import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';

export const useUser = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select(`
              email,
              roles (
                name
              )
            `)
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error loading profile:', error);
            throw error;
          }

          if (profile) {
            console.log('Profile loaded:', profile);
            setUserEmail(profile.email);
            setUserRole(profile.roles?.name || '');
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserEmail('');
        setUserRole('');
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && session) {
        await loadProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Logout successful, redirecting to auth...');
      navigate('/auth');
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { userEmail, userRole, handleLogout };
};