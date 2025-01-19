import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';

export interface AuthContextType {
  user: any;
  profile: Profile | null;
  isLoading: boolean;
  handleLogout: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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

        setUser(session.user);

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select(`
            *,
            roles (
              name
            )
          `)
          .eq('id', session.user.id)
          .single();

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

        if (profileData && mounted) {
          console.log('Profile loaded:', profileData);
          setProfile(profileData);
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
          setProfile(null);
          setUser(null);
          setIsLoading(false);
          navigate('/auth');
        }
      } else if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          setUser(session.user);
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
      setProfile(null);
      setUser(null);
      
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

  return { user, profile, isLoading, handleLogout };
};