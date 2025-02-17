import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useUser = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    const loadProfile = async () => {
      try {
        console.log('Loading user profile...');
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No active session found, redirecting to auth...');
          if (mounted) {
            setIsLoading(false);
            navigate('/auth');
          }
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
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
          if (mounted) {
            setIsLoading(false);
            if (error.code === 'PGRST116') {
              console.log('Profile not found, redirecting to auth...');
              await handleLogout();
            }
          }
          return;
        }

        if (profile && mounted) {
          console.log('Profile loaded:', profile);
          setUserEmail(profile.email);
          setUserRole(profile.roles?.name || '');
        }
      } catch (error) {
        console.error('Error in loadProfile:', error);
        if (mounted) {
          navigate('/auth');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUserEmail('');
          setUserRole('');
          setIsLoading(false);
          navigate('/auth');
        }
      } else if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          await loadProfile();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setUserEmail('');
      setUserRole('');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during sign out:', error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      }
      
      console.log('Navigating to auth page...');
      navigate('/auth');
      
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  return { userEmail, userRole, isLoading, handleLogout };
};