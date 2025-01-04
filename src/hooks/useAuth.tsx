import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          roles (
            name
          )
        `)
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return profile?.roles?.name || null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ User signed in:', session.user.email);
          setUser(session.user);
          const role = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUserRole(role || '');
          }
        }
      } catch (error) {
        console.error('Error in initAuth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (session?.user) {
        setUser(session.user);
        const role = await fetchUserProfile(session.user.id);
        if (mounted) {
          setUserRole(role || '');
        }
      } else {
        setUser(null);
        setUserRole('');
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserRole('');
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userRole,
    loading,
    isAdmin: userRole === 'admin',
    isAuthenticated: !!user,
    logout
  };
};