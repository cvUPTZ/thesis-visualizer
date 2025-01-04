import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userId: string | null;
  userRole: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  userId: null,
  userRole: null,
  logout: async () => {},
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
    console.log('Clearing auth state...');
    setIsAuthenticated(false);
    setUserId(null);
    setUserRole(null);
    setLoading(false);
    
    // Clear any auth-related items from storage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
    
    // Clear any other auth-related cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('Logging out...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during sign out:', error);
        throw error;
      }
      
      clearAuthState();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = async (error: any) => {
    console.error('Auth error:', error);
    await logout();
    
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

    // Initial auth check
    checkAuth();

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
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          clearAuthState();
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
          // Re-check auth status when token is refreshed
          checkAuth();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userId, userRole, logout }}>
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