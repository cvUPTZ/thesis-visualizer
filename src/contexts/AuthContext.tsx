import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  userId: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id || 'No session');
        setUserId(session?.user?.id || null);
      } catch (error) {
        console.error('Error checking session:', error);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        setUserId(session?.user?.id || null);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
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

      // Clear any local storage items
      localStorage.removeItem('supabase.auth.token');
      
      // Reset state
      setUserId(null);
      
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
    <AuthContext.Provider value={{ userId, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};