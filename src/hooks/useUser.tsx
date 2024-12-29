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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate('/auth');
          return;
        }

        if (!session) {
          if (mounted) {
            setUserEmail('');
            setUserRole('');
            navigate('/auth');
          }
          return;
        }

        // Only fetch profile if we have a valid session
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        if (profile && mounted) {
          setUserEmail(profile.email);
          setUserRole(profile.role);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          navigate('/auth');
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUserEmail('');
          setUserRole('');
          navigate('/auth');
        }
      } else if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile && mounted) {
          setUserEmail(profile.email);
          setUserRole(profile.role);
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
      console.log('Logging out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setUserEmail('');
      setUserRole('');
      
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
      });
      
      navigate('/auth');
    } catch (error: any) {
      console.error('Error in handleLogout:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  return {
    userEmail,
    userRole,
    handleLogout
  };
};