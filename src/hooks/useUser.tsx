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
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setUserEmail('');
            setUserRole('');
            navigate('/auth');
          }
          return;
        }

        if (!session) {
          console.log('No session found');
          if (mounted) {
            setUserEmail('');
            setUserRole('');
            navigate('/auth');
          }
          return;
        }

        console.log('Session found:', session);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, roles(name)')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        if (profile && mounted) {
          console.log('Profile loaded:', profile);
          setUserEmail(profile.email);
          setUserRole(profile.roles?.name || '');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) navigate('/auth');
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUserEmail('');
          setUserRole('');
          navigate('/auth');
        }
      } else if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('email, roles(name)')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile after sign in:', error);
          } else if (profile && mounted) {
            setUserEmail(profile.email);
            setUserRole(profile.roles?.name || '');
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        }
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Clear local state first
      setUserEmail('');
      setUserRole('');
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No active session found during logout');
        navigate('/auth');
        return;
      }

      // Perform logout
      const { error } = await supabase.auth.signOut({
        scope: 'local'  // Changed from 'global' to 'local'
      });
      
      if (error) {
        console.error('Error signing out:', error);
        toast({ 
          title: "Error", 
          description: "Failed to sign out. Please try again.", 
          variant: "destructive" 
        });
      } else {
        console.log('Logout successful');
        toast({ 
          title: "Success", 
          description: "You have been signed out successfully." 
        });
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error in handleLogout:', error);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred while signing out.", 
        variant: "destructive" 
      });
    }
  };

  return { userEmail, userRole, handleLogout };
};