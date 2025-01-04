import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  userId: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  loading: true,
  logout: async () => {},
  isAuthenticated: false,
  userRole: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          roles (
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return profile?.roles?.name || null;
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id || 'No session');
        
        if (session?.user) {
          setUserId(session.user.id);
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } else {
          setUserId(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUserId(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          setUserId(session.user.id);
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        }
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setUserRole(null);
        setLoading(false);
        navigate('/auth');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed for user:', session?.user?.email);
      }
    });

    return () => {
      console.log('Cleaning up auth state listener...');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    try {
      setLoading(true);
      console.log('Starting logout process...');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem('supabase.auth.token');
      setUserId(null);
      setUserRole(null);
      
      console.log('Logout successful, navigating to auth page...');
      navigate('/auth');
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
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

  return (
    <AuthContext.Provider value={{ 
      userId, 
      loading, 
      logout,
      isAuthenticated: !!userId,
      userRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};