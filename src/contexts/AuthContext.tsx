import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userId: string | null;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  userId: null,
  userRole: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          roles (
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      console.log('Profile data fetched:', profileData);
      return profileData;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const clearAuthState = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserRole(null);
    setLoading(false);
  };

  const handleAuthError = async (error: any) => {
    console.error('Auth error:', error);
    // Clear local storage and session storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Sign out to clear any invalid tokens
    await supabase.auth.signOut();
    clearAuthState();
    
    toast({
      title: "Authentication Error",
      description: "Please sign in again.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error checking session:', error);
          if (mounted) {
            await handleAuthError(error);
          }
          return;
        }

        if (!session) {
          console.log('No active session');
          if (mounted) {
            clearAuthState();
          }
          return;
        }

        console.log('Session found:', session.user.email);
        if (mounted) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData) {
            setUserRole(profileData.roles?.name || null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        if (mounted) {
          await handleAuthError(error);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in:', session.user.email);
          setIsAuthenticated(true);
          setUserId(session.user.id);
          
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData) {
            setUserRole(profileData.roles?.name || null);
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          console.log('User signed out or token refreshed');
          clearAuthState();
        }
      }
    );

    // Initial auth check
    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userId, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};