import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  handleLogout: () => Promise<void>;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  session: null,
  user: null,
  handleLogout: async () => {},
  userId: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setLoading(false);
        
        if (!session) {
          console.log('No active session, redirecting to auth...');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        handleAuthError(error as AuthError);
        setLoading(false);
        navigate('/auth');
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setSession(null);
        navigate('/auth');
      } else if (session) {
        setSession(session);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    let message = 'An authentication error occurred';
    
    if (error.message.includes('refresh_token_not_found')) {
      message = 'Your session has expired. Please sign in again.';
      handleLogout();
    }
    
    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
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

  const value = {
    isAuthenticated: !!session,
    loading,
    session,
    user: session?.user ?? null,
    handleLogout,
    userId: session?.user?.id ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};