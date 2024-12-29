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
    // First check if we have a session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
    };

    checkSession();

    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          setUserEmail(profile.email);
          setUserRole(profile.role);
        }
      }
    };

    fetchUserProfile();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUserEmail('');
        setUserRole('');
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && session) {
        // Refresh user profile when signed in
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          setUserEmail(profile.email);
          setUserRole(profile.role);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      
      // First clear the session from Supabase
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
      
      // Clear local state
      setUserEmail('');
      setUserRole('');
      
      // Show success message
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
      });
      
      // Navigate to auth page
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