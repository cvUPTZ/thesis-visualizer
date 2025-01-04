import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useUser = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        console.log('Loading user profile...');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No active session found, redirecting to auth...');
          navigate('/auth');
          return;
        }

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
          if (error.code === 'PGRST116') {
            console.log('Profile not found, redirecting to auth...');
            await handleLogout();
          }
          return;
        }

        if (profile) {
          console.log('Profile loaded:', profile);
          setUserEmail(profile.email);
          setUserRole(profile.roles?.name || '');
        }
      } catch (error) {
        console.error('Error in loadProfile:', error);
        navigate('/auth');
      }
    };

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
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
      // First clear local session
      setUserEmail('');
      setUserRole('');
      
      try {
        // Then attempt to sign out from Supabase
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error during sign out:', error);
          toast({
            title: "Error signing out",
            description: error.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Error during logout:', error);
      }
      
      // Always navigate to auth page
      console.log('Navigating to auth page...');
      navigate('/auth');
      
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      // Still navigate to auth page
      navigate('/auth');
    }
  };

  return { userEmail, userRole, handleLogout };
};